import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
	//this code runs on the server
	// Only publish items that are public or belong to the current owner
	Meteor.publish('tasks', function tasksPublication(){
		return Tasks.find({
			$or: [
				{ private: { $ne: true } },
				{ owner: this.userId },
			],
		});
	});
}


Meteor.methods({
	'tasks.insert'(text) {
		check(text, String);

		if (! this.userId) {
			throw new Meteor.Error('not-authorized!');
		}

		Tasks.insert({
			text,
			createdAt: new Date(),
			owner:this.userId,
			username:Meteor.users.findOne(this.userId).username,
		});
	},
	'tasks.remove'(taskId) {
		check(taskId, String);

		const task = Tasks.findOne(taskId);
		if (task.private && task.owner !== this.userId) {
			//If the item is private then only the owener can delete it
			throw new Meteor.Error('not-authorized');
		}

		Tasks.remove(taskId);
	},
	'tasks.setChecked'(taskId, setChecked) {
		check(taskId, String)
		check(setChecked, Boolean)

		const task = Tasks.findOne(taskId);
		if (task.private && task.owner !== this.userId) {
			//If the item is private then only the owener can check it
			throw new Meteor.Error('not-authorized');
		}		


		Tasks.update(taskId, { $set: { checked: setChecked } });
	},
	'tasks.setPrivate' (taskId, setToPrivate) {
		check(taskId, String);
		check(setToPrivate, Boolean);

		const task = Tasks.findOne(taskId);

		//this ensures that only the item owner can make an item private
		if (task.owner !== this.userId) {
			throw new Meteor.Error('not-autherized');
		}
		Tasks.update(taskId, { $set: { private: setToPrivate } });
	},
});