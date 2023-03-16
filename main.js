/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("// Returns the current project's title\nfunction getProjectTitle() {\n\n    if(document.querySelector('.project_title'))\n        return document.querySelector('.project_title').innerHTML;\n    else\n        return document.querySelector('.name_input').value;\n}\n\n// Returns the current project's index with respect to the list of projects\nfunction getProjectIdx() {\n\n    let title = getProjectTitle();\n\n    return project_list.findIndex(project => project.getTitle() === title);\n}\n\n// Shows the project / task form\nfunction showForm(type) {\n\n    let form_name = document.querySelector('.form_name');\n\n    modal.style.display = 'flex';\n    project_form.style.display = 'none';\n    task_form.style.display = 'none';\n\n    if(type === 'project')\n    {\n        form_name.innerHTML = 'Create new project';\n        project_form.style.display = 'flex';\n    }\n    else if(type === 'task')\n    {\n        form_name.innerHTML = 'Create new task';\n        task_form.style.display = 'flex';\n    }\n    else\n    {\n        console.error('Strange occurrence in showForm().');\n    }\n}\n\n// Shows the edit task form\nfunction showEditForm(task_idx, title, description, due_date, priority) {\n\n    let modal = document.querySelector('.edit_modal');\n\n    let idx = getProjectIdx();\n\n    let name = document.querySelector('.edit_task_name');\n    let desc = document.querySelector('.edit_task_desc');\n    let date = document.querySelector('.edit_due_date');\n    let prio = document.querySelector('.edit_priority');\n\n    name.value = title;\n    desc.value = description;\n    date.value = due_date;\n    prio.value = priority;\n\n    modal.style.display = 'flex';\n\n    info = taskInfo(idx, task_idx);\n}\n\n// Updates the project_list to localStorage\nfunction updateProjectList() {\n\n    let list_package = {};\n    project_list.forEach((project) => {\n\n        list_package[project.getTitle()] = project.toJSON();\n    });\n    localStorage.setItem('project_list', JSON.stringify(list_package));\n}\n\n// Calls project_list[idx] task_list[task_idx] to be editted\nfunction submitEdit(idx, task_idx, name, desc, date, prio) {\n\n    let modal = document.querySelector('.edit_modal');\n\n    project_list[idx].editTask(task_idx, name.value, desc.value, date.value, prio.value);\n    \n    // Reset edit form\n    modal.style.display = 'none';\n    name.value = '';\n    desc.value = '';\n    date.value = '';\n    prio.value = '';\n\n    // Update task list\n    openTasks(getProjectTitle());\n}\n\n// Stores the current project and task being editted\nconst taskInfo = (idx, task_idx) => {\n\n    const getProjectIdx = () => idx;\n    const getTaskIdx = () => task_idx;\n\n    return { getProjectIdx, getTaskIdx };\n}\n\n// Hides modal\nfunction hideForm() {\n\n    modal.style.display = 'none';\n}\n\n// Resets the project / task form\nfunction resetForm() {\n\n    let project_name = document.querySelector('.project_name');\n    let task_name = document.querySelector('.task_name');\n    let task_desc = document.querySelector('.task_desc');\n    let due_date = document.querySelector('.due_date');\n    let priority = document.querySelector('.priority');\n\n    project_name.value = '';\n    task_name.value = '';\n    task_desc.value = '';\n    due_date.value = '';\n    priority.value = '';\n}\n\n// Creates and adds project / task to respective list\nfunction createNew() {\n\n    if(project_form.style.display != 'none')\n    {\n        let project_name = document.querySelector('.project_name').value;\n        \n        let new_project = project_item(project_name);\n        project_list.push(new_project);\n\n        updateSidebar();\n    }\n    else if(task_form.style.display != 'none')\n    {\n        let idx = getProjectIdx();\n        \n        let task_name = document.querySelector('.task_name').value;\n        let task_desc = document.querySelector('.task_desc').value;\n        let due_date = document.querySelector('.due_date').value;\n        let priority = document.querySelector('.priority').value;\n\n        project_list[idx].addTask(task_name, task_desc, due_date, priority);\n\n        openTasks(getProjectTitle());\n    }\n    else\n    {\n        console.error('Strange occurrence in createNew().');\n    }\n    hideForm();\n    resetForm();\n}\n\n// Updates the sidebar to reflect the added project\nfunction updateSidebar() {\n\n    let sidebar = document.querySelector('.project_list');\n\n    sidebar.innerHTML = '';\n    project_list.forEach((project) => {\n        \n        let link = document.createElement('a');\n        link.setAttribute('class', 'project-' + project.getTitle());\n        link.innerHTML = project.getTitle();\n\n        link.addEventListener('click', (event) => {\n            \n            openTasks(event.target.className.replace('project-', ''));\n        })\n\n        sidebar.appendChild(link);\n    });\n}\n\n// Only open from within openTask()!!\nfunction updateTaskList() {\n\n    let idx = getProjectIdx();\n    let title = getProjectTitle();\n\n    let content = document.querySelector('.content');\n\n    project_list[idx].getTasks().forEach((task) => {\n\n        let div = document.createElement('div');\n        div.setAttribute('class', 'task-' + task.getTitle());\n\n        let checkbox = document.createElement('i');\n        checkbox.setAttribute('class', 'material-icons');\n        if(!task.getCompletion())\n            checkbox.innerHTML = 'check_box_outline_blank';\n        else\n            checkbox.innerHTML = 'check_box';\n        \n        checkbox.addEventListener('click', () => {\n\n            checkbox.innerHTML = 'check_box';\n            task.completeTask();\n\n            // Update localStorage\n            updateProjectList();\n        });\n\n        let name_desc = document.createElement('div');\n        name_desc.setAttribute('class', 'task_item_name_desc');\n\n        let task_name = document.createElement('p');\n        task_name.setAttribute('class', 'task_item_name');\n        task_name.innerHTML = task.getTitle();\n\n        name_desc.appendChild(task_name);\n\n        // Append description if entered\n        if(task.getDesc()) \n        {\n            let task_desc = document.createElement('p');\n            task_desc.setAttribute('class', 'task_item_desc');\n            task_desc.innerHTML = task.getDesc();\n            name_desc.appendChild(task_desc);\n        }\n\n        let due_date = document.createElement('p');\n        due_date.setAttribute('class', 'task_item_due_date');\n        due_date.innerHTML = `Due: ${task.getDueDate()}`;\n\n        div.classList.add(task.getPriority());\n\n        let edit = document.createElement('i');\n        edit.setAttribute('class', 'material-icons');\n        edit.innerHTML = 'edit';\n\n        edit.addEventListener('click', () => {\n\n            let task_idx = project_list[idx].findTaskIndex(task.getTitle());\n            showEditForm(task_idx, task.getTitle(), task.getDesc(), task.getDueDate(), task.getPriority());\n        });\n\n        let close = document.createElement('i');\n        close.setAttribute('class', 'material-icons');\n        close.classList.add('right');\n        close.innerHTML = 'close';\n\n        close.addEventListener('click', () => {\n\n            project_list[idx].removeTask(task.getTitle());\n            openTasks(title);\n\n            // Update localStorage\n            updateProjectList();\n        });\n\n        div.appendChild(checkbox);\n        div.appendChild(name_desc);\n        div.appendChild(due_date);\n        div.appendChild(edit);\n        div.appendChild(close);\n\n        content.appendChild(div);\n    });\n}\n\n// Updates the visual task list to that of a given project\nfunction openTasks(title) {\n    \n    let content = document.querySelector('.content');\n    let idx = project_list.findIndex(project => project.getTitle() === title);\n\n    content.innerHTML = '';\n\n    let header = document.createElement('div');\n    header.setAttribute('class', 'project_header');\n\n    let wrap = document.createElement('div');\n    wrap.setAttribute('class', 'wrapper')\n\n    let project_name = document.createElement('p');\n    project_name.setAttribute('class', 'project_title');\n    project_name.innerHTML = title;\n\n    let edit_icon = document.createElement('i');\n    edit_icon.setAttribute('class', 'material-icons');\n    edit_icon.innerHTML = 'edit';\n\n    edit_icon.addEventListener('click', () => {\n\n        if(edit_icon.innerHTML === 'edit')\n        {\n            edit_icon.innerHTML = 'save';\n\n            let input = document.createElement('input');\n            input.setAttribute('class', 'name_input');\n            input.value = project_name.innerHTML;\n\n            project_name.replaceWith(input);\n        }\n        else\n        {\n            let new_name = document.querySelector('.name_input');\n\n            if(project_list.findIndex(task => task.getTitle() === new_name.value) === idx || project_list.findIndex(task => task.getTitle() === new_name.value) === -1)\n            {\n                edit_icon.innerHTML = 'edit';\n\n                project_list[idx].editTitle(new_name.value);\n                \n                openTasks(new_name.value);\n                updateSidebar();\n\n                // Update localStorage\n                updateProjectList();\n            }\n            else\n            {\n                alert('This project name already exists.');\n            }\n        }\n    });\n\n    wrap.appendChild(project_name);\n    wrap.appendChild(edit_icon);\n\n    let delete_icon = document.createElement('i');\n    delete_icon.setAttribute('class', 'material-icons');\n    delete_icon.innerHTML = 'delete';\n\n    delete_icon.addEventListener('click', () => {\n\n        project_list.splice(idx, 1);\n        updateSidebar();\n        content.innerHTML = '';\n\n        // Update localStorage\n        updateProjectList();\n    });\n\n    header.appendChild(wrap);\n    header.appendChild(delete_icon);\n\n    content.append(header);\n\n\n    let add_task = document.createElement('button');\n    add_task.setAttribute('class', 'material-icons add_task');\n    add_task.innerHTML = 'add';\n\n    add_task.addEventListener('click', () => {\n\n        showForm('task');\n    });\n\n    content.append(add_task);\n\n    updateTaskList();\n}\n\n// Removes a project from the list of projects\nfunction removeProject(title) {\n\n    project_list.filter(project => project.getTitle() != title);\n}\n\n// Factory function for projects\nconst project_item = (title) => {\n\n    let task_list = [];\n\n    const getTitle = () => title;\n    const getTasks = () => task_list;\n\n    const addTask = (title, description, dueDate, priority, complete = false) => {\n        \n        let new_task = task_item(title, description, dueDate, priority, complete);\n        task_list.push(new_task);\n    };\n\n    const editTitle = (new_title) => {\n        title = new_title;\n    };\n\n    const removeTask = (task_title) => {\n        \n        let idx = task_list.findIndex(task => task.getTitle() === task_title);\n        task_list.splice(idx, 1);\n    };\n\n    const findTask = (title) => {\n\n        return task_list.find(task => task.getTitle() === title);\n    };\n\n    const findTaskIndex = (title) => {\n\n        return task_list.findIndex(task => task.getTitle() === title);\n    };\n\n    const editTask = (idx, new_title, new_desc, new_date, new_priority) => {\n\n        task_list[idx].editTask(new_title, new_desc, new_date, new_priority);\n    };\n\n    // This function repackages the project_item to be suitable for JSON.Stringify()\n    const toJSON = () => {\n\n        let project_package = {};\n        task_list.forEach((task) => {\n\n            project_package[task.getTitle()] = task.toJSON();\n        });\n        return project_package;\n    };\n\n    return { getTitle, getTasks, addTask, removeTask, findTask, findTaskIndex, editTitle, editTask, toJSON };\n};\n\n// Factory function for tasks\nconst task_item = (title, description, dueDate, priority, completion = false) => {\n\n    let complete = completion;\n\n    const getTitle = () => title;\n    const getDesc = () => description;\n    const getDueDate = () => dueDate;\n    const getPriority = () => priority;\n    const getCompletion = () => complete;\n\n    const completeTask = () => {\n\n        complete = true;\n    };\n\n    const editTask = (new_title, new_desc, new_date, new_priority) => {\n\n        if(!new_title || !new_date || !new_priority) return;\n\n        title = new_title;\n        description = new_desc;\n        dueDate = new_date;\n        priority = new_priority;\n    };\n\n    // This function repackages the task_item to be suitable for JSON.Stringify()\n    const toJSON = () => {\n\n        let task_package = { title: getTitle(), desc: getDesc(), dueDate: getDueDate(), priority: getPriority(), complete: getCompletion() };\n        return task_package;\n    };\n\n    return { getTitle, getDesc, getDueDate, getPriority, getCompletion, completeTask, editTask, toJSON };\n};\n\n/* Load list of projects from the Web Storage API */\nlet project_list = [];\nif(localStorage['project_list'])\n{\n    let list_package = JSON.parse(localStorage.getItem('project_list'));\n\n    // Process the retrieved list package to recreate the list of projects\n    for(const [project_name, task_list] of Object.entries(list_package)) {\n\n        let project = project_item(project_name);\n\n        for(const [task_name, task_properties] of Object.entries(task_list)) {\n\n            project.addTask(task_properties.title, task_properties.desc, task_properties.dueDate, task_properties.priority, task_properties.complete);\n        }\n        project_list.push(project);\n    }\n\n    updateSidebar();\n}\nelse\n{\n    console.log('no list found');\n    project_list = [];\n}\n/*==================== END LOAD ==================*/\n\nlet expandBtn = document.querySelector('.expand');\nlet sidebar = document.querySelector('.sidebar');\nlet content = document.querySelector('.content');\n\nlet sidebarWidth = '250px';\nlet expand = false\n\n/* Sidebar expand logic */\nexpandBtn.addEventListener('click', () => {\n\n    if(!expand)\n    {\n        sidebar.style.width = sidebarWidth;\n        content.style.marginLeft = sidebarWidth;\n    }\n    else\n    {\n        sidebar.style.width = 0;\n        content.style.marginLeft = 0;\n    }\n    expand = !expand;\n});\n/*======================*/\n\nlet modal = document.querySelector('.modal');\nlet project_form = document.querySelector('.project_form');\nlet task_form = document.querySelector('.task_form');\n\nmodal.addEventListener('click', (event) => {\n\n    if(event.target.className === 'modal')\n    {\n        hideForm();\n        resetForm();\n    }\n});\n\nlet addProj = document.querySelector('.add_project');\n\naddProj.addEventListener('click', () => {\n\n    showForm('project');\n});\n\n/* New project / task submit button logic */\nlet submit = document.querySelector('.submit');\n\nsubmit.addEventListener('click', () => {\n\n    if(project_form.style.display != 'none')\n    {   \n        let project_name = document.querySelector('.project_name').value;\n\n        if(project_name.length < 1)\n        {\n            alert('The project name must have at least one character.');\n            return;\n        }\n        else if(project_list.find(project => project.getTitle() === project_name))\n        {\n            alert('This project name already exists.');\n            return;\n        }\n    }\n    else if(task_form.style.display != 'none')\n    {\n        let idx = getProjectIdx();\n\n        let task_name = document.querySelector('.task_name').value;\n        let due_date = document.querySelector('.due_date').value;\n        let priority = document.querySelector('.priority').value;\n\n        if(task_name.length < 1)\n        {\n            alert('The task name must have at least one character.');\n            return;\n        }\n        else if(project_list[idx].findTask(task_name))\n        {\n            alert('This task name already exists in this project.')\n            return;\n        }\n        else if(!isNaN(due_date))\n        {\n            alert('The date entered is invalid.');\n            return;\n        }\n        else if(!priority)\n        {\n            alert('Please select the task priority.');\n            return;\n        }\n    }\n    createNew();\n\n    // Update localStorage\n    updateProjectList();\n});\n/* ====================================== */\n\nlet edit_modal = document.querySelector('.edit_modal');\n\nedit_modal.addEventListener('click', (event) => {\n\n    if(event.target.className === 'edit_modal')\n    {\n        let task_name = document.querySelector('.edit_task_name');\n        let task_desc = document.querySelector('.edit_task_desc');\n        let due_date = document.querySelector('.edit_due_date');\n        let priority = document.querySelector('.edit_priority');\n\n        task_name.value = '';\n        task_desc.value = '';\n        due_date.value = '';\n        priority.value = '';\n\n        edit_modal.style.display = 'none';\n    }\n});\n\n/* Edit task logic */\nlet info;\nlet edit = document.querySelector('.edit_submit');\n\nedit.addEventListener('click', () => {\n\n    let idx = getProjectIdx();\n\n    let name = document.querySelector('.edit_task_name');\n    let desc = document.querySelector('.edit_task_desc');\n    let date = document.querySelector('.edit_due_date');\n    let prio = document.querySelector('.edit_priority');\n\n    if(name.value.length < 1)\n    {\n        alert('The task name must have at least one character.');\n        return;\n    }\n    else if(project_list[idx].findTask(name.value))\n    {\n        alert('This task name already exists in this project.')\n        return;\n    }\n    else if(!isNaN(date.value))\n    {\n        alert('The date entered is invalid.');\n        return;\n    }\n    else if(!prio.value)\n    {\n        alert('Please select the task priority.');\n        return;\n    }\n\n    submitEdit(info.getProjectIdx(), info.getTaskIdx(), name, desc, date, prio);\n    \n    // Update localStorage\n    updateProjectList();\n});\n/* ============== */\n\n\n//# sourceURL=webpack://the-odin-project-todo-list/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;