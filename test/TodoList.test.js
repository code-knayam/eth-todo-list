const TodoList = artifacts.require("./TodoList.sol");

contract("TodoList", (accounts) => {
	before(async () => {
		this.todoList = await TodoList.deployed();
	});

	it("deplos successfully", async () => {
		const address = await this.todoList.address;
		assert.notEqual(address, undefined);
	});

	it("lists tasks", async () => {
		const taskCount = await this.todoList.taskCount();
		const task = await this.todoList.tasks(taskCount);
		assert.equal(task.id.toNumber(), taskCount.toNumber());
	});

	it("create task", async () => {
		const result = await this.todoList.createTask("A new task");
		const taskCount = await this.todoList.taskCount();

		assert.equal(taskCount, 2);

		const event = result.logs[0].args;
		assert.equal(event.id.toNumber(), 2);
	});

	it("toggles task completion", async () => {
		const result = await this.todoList.toggleCompleted(1);
		const task = await this.todoList.tasks(1);

		assert.equal(task.completed, true);

		const event = result.logs[0].args;
		assert.equal(event.id.toNumber(), 1);
		assert.equal(event.completed, true);
	});

	it("delete task", async () => {
		const result = await this.todoList.deleteTask(1);
		const taskCount = await this.todoList.taskCount();
		const task = await this.todoList.tasks(1);

		assert.equal(taskCount, 2);
		assert.equal(task.id, 0);

		const event = result.logs[0].args;
		assert.equal(event.id.toNumber(), 1);
	});
});
