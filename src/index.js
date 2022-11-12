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

function hideForm() {

    modal.style.display = 'none';
}

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
        let title = document.querySelector('.project_title').innerHTML;
        let idx = project_list.findIndex(project => project.getTitle() === title);
        
        let task_name = document.querySelector('.task_name').value;
        let task_desc = document.querySelector('.task_desc').value;
        let due_date = document.querySelector('.due_date').value;
        let priority = document.querySelector('.priority').value;

        project_list[idx].addTask(task_name, task_desc, due_date, priority);

        openTasks(title);
    }
    else
    {
        console.error('Strange occurrence in createNew().');
    }
    hideForm();
    resetForm();
}

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

function updateTaskList() {

    let title = document.querySelector('.project_title').innerHTML;
    let idx = project_list.findIndex(project => project.getTitle() === title);

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

        let close = document.createElement('i');
        close.setAttribute('class', 'material-icons');
        close.classList.add('right');
        close.innerHTML = 'close';

        close.addEventListener('click', () => {

            project_list[idx].removeTask(task.getTitle());
            openTasks(title);
        });

        div.appendChild(checkbox);
        div.appendChild(name_desc);
        div.appendChild(due_date);
        div.appendChild(edit);
        div.appendChild(close);

        content.appendChild(div);
    });
}

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

    wrap.appendChild(project_name);
    wrap.appendChild(edit_icon);

    let delete_icon = document.createElement('i');
    delete_icon.setAttribute('class', 'material-icons');
    delete_icon.innerHTML = 'delete';

    delete_icon.addEventListener('click', () => {

        project_list.splice(idx, 1);
        updateSidebar();
        content.innerHTML = '';
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

function removeProject(title) {

    project_list.filter(project => project.getTitle() != title);
}

const project_item = (title) => {

    let task_list = [];

    const getTitle = () => title;
    const getTasks = () => task_list;

    const addTask = (title, description, dueDate, priority) => {
        
        let new_task = task_item(title, description, dueDate, priority);
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

    return { getTitle, getTasks, addTask, removeTask, findTask, editTitle };
};

const task_item = (title, description, dueDate, priority) => {

    let complete = false;

    const getTitle = () => title;
    const getDesc = () => description;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    const getCompletion = () => complete;

    const completeTask = () => {

        complete = true;
    };

    return { getTitle, getDesc, getDueDate, getPriority, getCompletion, completeTask };
};

/* Load list of projects from the Web Storage API */
let project_list;
if(localStorage['project_list'])
{
    project_list = localStorage['project_list'];
}
else
{
    project_list = [];
}
/*==================== END LOAD ==================*/

let expandBtn = document.querySelector('.expand');
let sidebar = document.querySelector('.sidebar');
let content = document.querySelector('.content');

let sidebarWidth = '250px';
let expand = false

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
            alert('This project name already exists.')
            return;
        }
    }
    else if(task_form.style.display != 'none')
    {
        let title = document.querySelector('.project_title').innerHTML;
        let idx = project_list.findIndex(project => project.getTitle() === title);

        let task_name = document.querySelector('.task_name').value;
        let due_date = document.querySelector('.due_date').value;
        let priority = document.querySelector('.priority').value;

        if(task_name.length < 1)
        {
            alert('The task name must have at least one character.');
            return;
        }
        else if(project_list[idx].getTasks().find(task => task.getTitle() === task_name))
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
});