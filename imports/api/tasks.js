import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
	//this code runs on the server
	Meteor.publish('tasks', function tasksPublication(){
		return Tasks.find();
	});
}


Meteor.methods({
	'tasks.insert'(text) {
		check(text, String);

		if (! this.userId) {
			throw new Meteor.Error('Sorry you are not autherized!');
		}

		Tasks.insert({
			text,
			createdAt: new Date(),
			owner:this.userId,
			username:Meteor.users.findOne(this.userId).username,
		});
	},
	'tasks.remove'(setChecked) {
		check(taskId, String);

		Tasks.remove(taskId);
	},
	'tasks.setChecked'(taskId, setChecked) {
		check(taskId, String)
		check(setChecked, Boolean)

		Tasks.update(taskId, { $set: { checked: setChecked } });
	},
	'tasks.setPrivate' (taskId, setToPrivate) {
		check(taskId, String);
		check(setToPrivate, Boolean);

		const task = Task.findOne(taskId);

		//this ensures that only the item owner can make an item private
		if (task.owner !== this.userId) {
			throw new Meteor.Error('not-autherized');
		}
		Tasks.update(taskId, { $set: { private: setToPrivate } });
	},
});