const todo_item = (title, description, dueDate, priority) => {

    let complete = false;

    const getTitle = () => title;
    const getDesc = () => description;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    const getCompletion = () => complete;

    const completeTask = () => {
        complete = true;
    }

    return { getTitle, getDesc, getDueDate, getPriority, getCompletion, completeTask };
};

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