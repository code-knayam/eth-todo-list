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
});
