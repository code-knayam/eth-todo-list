// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract TodoList {
    uint public taskCount;
    mapping(uint => Task) public tasks;
    event TaskCreated(uint id, string content, bool completed);

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    constructor() {
        createTask("Default Task");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);

        emit TaskCreated(taskCount, _content, false);
    }
}
