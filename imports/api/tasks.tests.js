// esLint-env moca

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';


import { Tasks } from './tasks.js';

if (Meteor.isServer) {
	describe ('Tasks', ()=> {
		describe ('Methods', ()=>{
			const userId = Random.id();
			let taskId;

			beforeEach(() => {
				Tasks.remove({});
				taskId = Tasks.insert({
					text: 'test task',
					createdAt: new Date(),
					owner: userId,
					username: 'tmeasday'
				});
			});
			it('can delete own task', ()=>{
				//first find the internal implementaion of the task method so it can be tested
				//in isolation
				const deleteTask = Meteor.server.method_handlers['tasks.remove'];

				//set up a fake method invocation that looks like what the method expects
				const invocation = { userId };

				//run the method with this 'set' to the fake invocation 
				deleteTask.apply(invocation, [taskId]);

				//verify that the method does what is expected
				assert.equal(Tasks.find().count(), 0);
			});
		});
	});
}
