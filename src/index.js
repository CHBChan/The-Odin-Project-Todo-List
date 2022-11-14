// Returns the current project's title
function getProjectTitle() {

    if(document.querySelector('.project_title'))
        return document.querySelector('.project_title').innerHTML;
    else
        return document.querySelector('.name_input').value;
}

// Returns the current project's index with respect to the list of projects
function getProjectIdx() {

    let title = getProjectTitle();

    return project_list.findIndex(project => project.getTitle() === title);
}

// Shows the project / task form
function showForm(type) {

    let form_name = document.querySelector('.form_name');

    modal.style.display = 'flex';
    project_form.style.display = 'none';
    task_form.style.display = 'none';

    if(type === 'project')
    {
        form_name.innerHTML = 'Create new project';
        project_form.style.display = 'flex';
    }
    else if(type === 'task')
    {
        form_name.innerHTML = 'Create new task';
        task_form.style.display = 'flex';
    }
    else
    {
        console.error('Strange occurrence in showForm().');
    }
}

// Shows the edit task form
function showEditForm(task_idx, title, description, due_date, priority) {

    let modal = document.querySelector('.edit_modal');

    let idx = getProjectIdx();

    let name = document.querySelector('.edit_task_name');
    let desc = document.querySelector('.edit_task_desc');
    let date = document.querySelector('.edit_due_date');
    let prio = document.querySelector('.edit_priority');

    name.value = title;
    desc.value = description;
    date.value = due_date;
    prio.value = priority;

    modal.style.display = 'flex';

    info = taskInfo(idx, task_idx);
}

// Updates the project_list to localStorage
function updateProjectList() {

    let list_package = {};
    project_list.forEach((project) => {

        list_package[project.getTitle()] = project.toJSON();
    });
    localStorage.setItem('project_list', JSON.stringify(list_package));
}

// Calls project_list[idx] task_list[task_idx] to be editted
function submitEdit(idx, task_idx, name, desc, date, prio) {

    let modal = document.querySelector('.edit_modal');

    project_list[idx].editTask(task_idx, name.value, desc.value, date.value, prio.value);
    
    // Reset edit form
    modal.style.display = 'none';
    name.value = '';
    desc.value = '';
    date.value = '';
    prio.value = '';

    // Update task list
    openTasks(getProjectTitle());
}

// Stores the current project and task being editted
const taskInfo = (idx, task_idx) => {

    const getProjectIdx = () => idx;
    const getTaskIdx = () => task_idx;

    return { getProjectIdx, getTaskIdx };
}

// Hides modal
function hideForm() {

    modal.style.display = 'none';
}

// Resets the project / task form
function resetForm() {

    let project_name = document.querySelector('.project_name');
    let task_name = document.querySelector('.task_name');
    let task_desc = document.querySelector('.task_desc');
    let due_date = document.querySelector('.due_date');
    let priority = document.querySelector('.priority');

    project_name.value = '';
    task_name.value = '';
    task_desc.value = '';
    due_date.value = '';
    priority.value = '';
}

// Creates and adds project / task to respective list
function createNew() {

    if(project_form.style.display != 'none')
    {
        let project_name = document.querySelector('.project_name').value;
        
        let new_project = project_item(project_name);
        project_list.push(new_project);

        updateSidebar();
    }
    else if(task_form.style.display != 'none')
    {
        let idx = getProjectIdx();
        
        let task_name = document.querySelector('.task_name').value;
        let task_desc = document.querySelector('.task_desc').value;
        let due_date = document.querySelector('.due_date').value;
        let priority = document.querySelector('.priority').value;

        project_list[idx].addTask(task_name, task_desc, due_date, priority);

        openTasks(getProjectTitle());
    }
    else
    {
        console.error('Strange occurrence in createNew().');
    }
    hideForm();
    resetForm();
}

// Updates the sidebar to reflect the added project
function updateSidebar() {

    let sidebar = document.querySelector('.project_list');

    sidebar.innerHTML = '';
    project_list.forEach((project) => {
        
        let link = document.createElement('a');
        link.setAttribute('class', 'project-' + project.getTitle());
        link.innerHTML = project.getTitle();

        link.addEventListener('click', (event) => {
            
            openTasks(event.target.className.replace('project-', ''));
        })

        sidebar.appendChild(link);
    });
}

// Only open from within openTask()!!
function updateTaskList() {

    let idx = getProjectIdx();
    let title = getProjectTitle();

    let content = document.querySelector('.content');

    project_list[idx].getTasks().forEach((task) => {

        let div = document.createElement('div');
        div.setAttribute('class', 'task-' + task.getTitle());

        let checkbox = document.createElement('i');
        checkbox.setAttribute('class', 'material-icons');
        if(!task.getCompletion())
            checkbox.innerHTML = 'check_box_outline_blank';
        else
            checkbox.innerHTML = 'check_box';
        
        checkbox.addEventListener('click', () => {

            checkbox.innerHTML = 'check_box';
            task.completeTask();

            // Update localStorage
            updateProjectList();
        });

        let name_desc = document.createElement('div');
        name_desc.setAttribute('class', 'task_item_name_desc');

        let task_name = document.createElement('p');
        task_name.setAttribute('class', 'task_item_name');
        task_name.innerHTML = task.getTitle();

        name_desc.appendChild(task_name);

        // Append description if entered
        if(task.getDesc()) 
        {
            let task_desc = document.createElement('p');
            task_desc.setAttribute('class', 'task_item_desc');
            task_desc.innerHTML = task.getDesc();
            name_desc.appendChild(task_desc);
        }

        let due_date = document.createElement('p');
        due_date.setAttribute('class', 'task_item_due_date');
        due_date.innerHTML = `Due: ${task.getDueDate()}`;

        div.classList.add(task.getPriority());

        let edit = document.createElement('i');
        edit.setAttribute('class', 'material-icons');
        edit.innerHTML = 'edit';

        edit.addEventListener('click', () => {

            let task_idx = project_list[idx].findTaskIndex(task.getTitle());
            showEditForm(task_idx, task.getTitle(), task.getDesc(), task.getDueDate(), task.getPriority());
        });

        let close = document.createElement('i');
        close.setAttribute('class', 'material-icons');
        close.classList.add('right');
        close.innerHTML = 'close';

        close.addEventListener('click', () => {

            project_list[idx].removeTask(task.getTitle());
            openTasks(title);

            // Update localStorage
            updateProjectList();
        });

        div.appendChild(checkbox);
        div.appendChild(name_desc);
        div.appendChild(due_date);
        div.appendChild(edit);
        div.appendChild(close);

        content.appendChild(div);
    });
}

// Updates the visual task list to that of a given project
function openTasks(title) {
    
    let content = document.querySelector('.content');
    let idx = project_list.findIndex(project => project.getTitle() === title);

    content.innerHTML = '';

    let header = document.createElement('div');
    header.setAttribute('class', 'project_header');

    let wrap = document.createElement('div');
    wrap.setAttribute('class', 'wrapper')

    let project_name = document.createElement('p');
    project_name.setAttribute('class', 'project_title');
    project_name.innerHTML = title;

    let edit_icon = document.createElement('i');
    edit_icon.setAttribute('class', 'material-icons');
    edit_icon.innerHTML = 'edit';

    edit_icon.addEventListener('click', () => {

        if(edit_icon.innerHTML === 'edit')
        {
            edit_icon.innerHTML = 'save';

            let input = document.createElement('input');
            input.setAttribute('class', 'name_input');
            input.value = project_name.innerHTML;

            project_name.replaceWith(input);
        }
        else
        {
            let new_name = document.querySelector('.name_input');

            if(project_list.findIndex(task => task.getTitle() === new_name.value) === idx || project_list.findIndex(task => task.getTitle() === new_name.value) === -1)
            {
                edit_icon.innerHTML = 'edit';

                project_list[idx].editTitle(new_name.value);
                
                openTasks(new_name.value);
                updateSidebar();

                // Update localStorage
                updateProjectList();
            }
            else
            {
                alert('This project name already exists.');
            }
        }
    });

    wrap.appendChild(project_name);
    wrap.appendChild(edit_icon);

    let delete_icon = document.createElement('i');
    delete_icon.setAttribute('class', 'material-icons');
    delete_icon.innerHTML = 'delete';

    delete_icon.addEventListener('click', () => {

        project_list.splice(idx, 1);
        updateSidebar();
        content.innerHTML = '';

        // Update localStorage
        updateProjectList();
    });

    header.appendChild(wrap);
    header.appendChild(delete_icon);

    content.append(header);


    let add_task = document.createElement('button');
    add_task.setAttribute('class', 'material-icons add_task');
    add_task.innerHTML = 'add';

    add_task.addEventListener('click', () => {

        showForm('task');
    });

    content.append(add_task);

    updateTaskList();
}

// Removes a project from the list of projects
function removeProject(title) {

    project_list.filter(project => project.getTitle() != title);
}

// Factory function for projects
const project_item = (title) => {

    let task_list = [];

    const getTitle = () => title;
    const getTasks = () => task_list;

    const addTask = (title, description, dueDate, priority, complete = false) => {
        
        let new_task = task_item(title, description, dueDate, priority, complete);
        task_list.push(new_task);
    };

    const editTitle = (new_title) => {
        title = new_title;
    };

    const removeTask = (task_title) => {
        
        let idx = task_list.findIndex(task => task.getTitle() === task_title);
        task_list.splice(idx, 1);
    };

    const findTask = (title) => {

        return task_list.find(task => task.getTitle() === title);
    };

    const findTaskIndex = (title) => {

        return task_list.findIndex(task => task.getTitle() === title);
    };

    const editTask = (idx, new_title, new_desc, new_date, new_priority) => {

        task_list[idx].editTask(new_title, new_desc, new_date, new_priority);
    };

    // This function repackages the project_item to be suitable for JSON.Stringify()
    const toJSON = () => {

        let project_package = {};
        task_list.forEach((task) => {

            project_package[task.getTitle()] = task.toJSON();
        });
        return project_package;
    };

    return { getTitle, getTasks, addTask, removeTask, findTask, findTaskIndex, editTitle, editTask, toJSON };
};

// Factory function for tasks
const task_item = (title, description, dueDate, priority, completion = false) => {

    let complete = completion;

    const getTitle = () => title;
    const getDesc = () => description;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    const getCompletion = () => complete;

    const completeTask = () => {

        complete = true;
    };

    const editTask = (new_title, new_desc, new_date, new_priority) => {

        if(!new_title || !new_date || !new_priority) return;

        title = new_title;
        description = new_desc;
        dueDate = new_date;
        priority = new_priority;
    };

    // This function repackages the task_item to be suitable for JSON.Stringify()
    const toJSON = () => {

        let task_package = { title: getTitle(), desc: getDesc(), dueDate: getDueDate(), priority: getPriority(), complete: getCompletion() };
        return task_package;
    };

    return { getTitle, getDesc, getDueDate, getPriority, getCompletion, completeTask, editTask, toJSON };
};

/* Load list of projects from the Web Storage API */
let project_list = [];
if(localStorage['project_list'])
{
    let list_package = JSON.parse(localStorage.getItem('project_list'));

    // Process the retrieved list package to recreate the list of projects
    for(const [project_name, task_list] of Object.entries(list_package)) {

        let project = project_item(project_name);

        for(const [task_name, task_properties] of Object.entries(task_list)) {

            project.addTask(task_properties.title, task_properties.desc, task_properties.dueDate, task_properties.priority, task_properties.complete);
        }
        project_list.push(project);
    }

    updateSidebar();
}
else
{
    console.log('no list found');
    project_list = [];
}
/*==================== END LOAD ==================*/

let expandBtn = document.querySelector('.expand');
let sidebar = document.querySelector('.sidebar');
let content = document.querySelector('.content');

let sidebarWidth = '250px';
let expand = false

/* Sidebar expand logic */
expandBtn.addEventListener('click', () => {

    if(!expand)
    {
        sidebar.style.width = sidebarWidth;
        content.style.marginLeft = sidebarWidth;
    }
    else
    {
        sidebar.style.width = 0;
        content.style.marginLeft = 0;
    }
    expand = !expand;
});
/*======================*/

let modal = document.querySelector('.modal');
let project_form = document.querySelector('.project_form');
let task_form = document.querySelector('.task_form');

modal.addEventListener('click', (event) => {

    if(event.target.className === 'modal')
    {
        hideForm();
        resetForm();
    }
});

let addProj = document.querySelector('.add_project');

addProj.addEventListener('click', () => {

    showForm('project');
});

/* New project / task submit button logic */
let submit = document.querySelector('.submit');

submit.addEventListener('click', () => {

    if(project_form.style.display != 'none')
    {   
        let project_name = document.querySelector('.project_name').value;

        if(project_name.length < 1)
        {
            alert('The project name must have at least one character.');
            return;
        }
        else if(project_list.find(project => project.getTitle() === project_name))
        {
            alert('This project name already exists.');
            return;
        }
    }
    else if(task_form.style.display != 'none')
    {
        let idx = getProjectIdx();

        let task_name = document.querySelector('.task_name').value;
        let due_date = document.querySelector('.due_date').value;
        let priority = document.querySelector('.priority').value;

        if(task_name.length < 1)
        {
            alert('The task name must have at least one character.');
            return;
        }
        else if(project_list[idx].findTask(task_name))
        {
            alert('This task name already exists in this project.')
            return;
        }
        else if(!isNaN(due_date))
        {
            alert('The date entered is invalid.');
            return;
        }
        else if(!priority)
        {
            alert('Please select the task priority.');
            return;
        }
    }
    createNew();

    // Update localStorage
    updateProjectList();
});
/* ====================================== */

let edit_modal = document.querySelector('.edit_modal');

edit_modal.addEventListener('click', (event) => {

    if(event.target.className === 'edit_modal')
    {
        let task_name = document.querySelector('.edit_task_name');
        let task_desc = document.querySelector('.edit_task_desc');
        let due_date = document.querySelector('.edit_due_date');
        let priority = document.querySelector('.edit_priority');

        task_name.value = '';
        task_desc.value = '';
        due_date.value = '';
        priority.value = '';

        edit_modal.style.display = 'none';
    }
});

/* Edit task logic */
let info;
let edit = document.querySelector('.edit_submit');

edit.addEventListener('click', () => {

    let idx = getProjectIdx();

    let name = document.querySelector('.edit_task_name');
    let desc = document.querySelector('.edit_task_desc');
    let date = document.querySelector('.edit_due_date');
    let prio = document.querySelector('.edit_priority');

    if(name.value.length < 1)
    {
        alert('The task name must have at least one character.');
        return;
    }
    else if(project_list[idx].findTask(name.value))
    {
        alert('This task name already exists in this project.')
        return;
    }
    else if(!isNaN(date.value))
    {
        alert('The date entered is invalid.');
        return;
    }
    else if(!prio.value)
    {
        alert('Please select the task priority.');
        return;
    }

    submitEdit(info.getProjectIdx(), info.getTaskIdx(), name, desc, date, prio);
    
    // Update localStorage
    updateProjectList();
});
/* ============== */
