App = {
	contracts: {},
	loading: false,
	load: async () => {
		console.log("Loading app");
		await App.loadWeb3();
		await App.loadAccount();
		await App.loadContract();
		await App.render();
	},
	// https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
	loadWeb3: async () => {
		if (window.ethereum) {
			window.web3 = new Web3(ethereum);
			try {
				// Request account access if needed
				await ethereum.enable();
				// Acccounts now exposed
			} catch (error) {
				// User denied account access...
			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			window.web3 = new Web3(web3.currentProvider);
		}
		// Non-dapp browsers...
		else {
			console.log(
				"Non-Ethereum browser detected. You should consider trying MetaMask!"
			);
		}
	},

	loadAccount: async () => {
		App.account = await web3.eth.getAccounts();
	},

	loadContract: async () => {
		const todoList = await $.getJSON("TodoList.json");
		App.contracts.TodoList = TruffleContract(todoList);
		App.contracts.TodoList.setProvider(ethereum);

		App.todoList = await App.contracts.TodoList.deployed();
	},

	render: async () => {
		if (App.loading) {
			return;
		}

		App.setLoading(true);
		console.log(App.account);
		$("#account").html(App.account[0]);

		await App.renderTasks();

		App.setLoading(false);
	},

	renderTasks: async () => {
		const tasksCount = await App.todoList.taskCount();
		const $taskTmp = $(".taskTemplate");

		for (let index = 1; index <= tasksCount; index++) {
			const task = await App.todoList.tasks(index);
			const taskId = task[0].toNumber();
			const taskContent = task[1];
			const taskCompleted = task[2];

			if (!taskId) continue;

			const $newTemp = $taskTmp.clone();

			$newTemp.find(".taskName").html(taskContent);
			$newTemp
				.find("input")
				.prop("name", taskId)
				.prop("checked", taskCompleted)
				.on("click", App.toggleCompleted);

			if (taskCompleted) {
				$newTemp.find(".taskCheckbox").prop("checked", true);
				$newTemp.find(".taskName").addClass("text-decoration-line-through");
			}

			$("#taskList").append($newTemp);
			$newTemp.show();
		}
	},

	createTask: async () => {
		if (App.loading) {
			return;
		}
		App.setLoading(true);
		const content = $("#newTask").val();
		await App.todoList.createTask(content, { from: App.account[0] });
		window.location.reload();
	},

	toggleCompleted: async (e) => {
		App.setLoading(true);
		const taskId = e.target.name;
		await App.todoList.toggleCompleted(taskId, { from: App.account[0] });
		window.location.reload();
	},

	deleteTask: async (id) => {
		App.setLoading(true);
		await App.todoList.deleteTask(id, { from: App.account[0] });
		window.location.reload();
	},

	setLoading: (boolean) => {
		App.loading = boolean;
		const loader = $("#loader");
		const content = $("#content");
		if (boolean) {
			loader.show();
			content.hide();
		} else {
			loader.hide();
			content.show();
		}
	},
};

$(() => {
	$(window).load(() => {
		App.load();
	});
});
