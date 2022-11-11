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

        console.log(`submitted new project ${project_name}`);
        
        let new_project = project_item(project_name);
        project_list.push(new_project);
        
        project_list.forEach((proj) => {
            console.log(proj.getTitle());
        });
    }
    else if(task_form.style.display != 'none')
    {
        console.log('submitted new task');

    }
    else
    {
        console.error('Strange occurrence in createNew().');
    }
    hideForm();
    resetForm();
}

function updateSidebar() {

    let sidebar = document.querySelector('sidebar');
    
}

const project_item = (title) => {

    let task_list = [];

    const getTitle = () => title;
    const getTasks = () => task_list;

    const addTask = (title, description, dueDate, priority) => {
        
        let new_task = task_item(title, description, dueDate, priority);
        task_list.push(new_task);
    };

    const removeTask = (title, description, dueDate, priority) => {

    };

    return { getTitle, getTasks, addTask, removeTask };
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
    console.log(expand);
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
    }
    else if(task_form.style.display != 'none')
    {
        let task_name = document.querySelector('.task_name').value;
        let due_date = document.querySelector('.due_date').value;

        if(task_name.length < 1)
        {
            alert('The task name must have at least one character.');
            return;
        }
        else if(!isNaN(due_date))
        {
            alert('The date entered is invalid.');
            return;
        }
    }
    createNew();
});