class Task {
  constructor(name, date, priority, desc, parenttask) {
    this.name = name;
    this.desc = desc;
    if (date === '') {
      this.date = new Date();
    } else { this.date = new Date(date); }
    this.priority = priority;
    this.subtasks = [];
    this.parenttask = parenttask;
  }

  addsubtask(task) {
    task.addparent(this);
    this.subtasks.push(task);
  }

  removesubtask(task) {
    this.subtasks.splice(this.subtasks.indexOf(task), 1);
  }

  addparent(task) {
    this.parenttask = task;
  }
}

class List {
  constructor() {
    this.username = 'User';
    this.tasks = [];
    this.subtasks = [];
    this.points = 0;
    this.streak = 0;
    this.date = new Date();

    this.sorttype = '1-100';
    this.UIColor = 'slategray';
    this.font = 'Arial';
    this.fontColor = 'black';
    this.lastcompletedtaskdate = null;
    this.showTopXhome = 5;
  }

  loadList(list) {
    this.username = list.username;
    this.tasks = [];
    this.subtasks = [];
    for (const t of list.tasks) {
      const T = new Task(t.name, t.date, t.priority, t.desc);
      for (const st of list.subtasks) {
        const sT = new Task(st.name, st.date, st.priority, st.desc, T);
        T.subtasks.push(sT);
        this.subtasks.push(sT);
      }
      this.tasks.push(T);
    }
    this.points = list.points;
    this.streak = list.streak;
    this.date = new Date();
    this.sorttype = list.sorttype;
    this.font = list.font;
    this.UIColor = list.UIColor;
    this.fontColor = list.fontColor;
    if (list.lastcompletedtaskdate != null) {
      this.lastcompletedtaskdate = new Date(list.lastcompletedtaskdate);
    } else this.lastcompletedtaskdate = null;
    this.showTopXhome = list.showTopXhome;
  }

  // tasknum is the index of a task in the main task list you want to add this subtask too
  addtask(name, date, priority, desc, tasknum) {
    const task = new Task(name, date, priority, desc);
    if (tasknum !== undefined) {
      const parenttask = this.tasks[tasknum];
      this.subtasks.push(task);
      parenttask.addsubtask(task);
    } else {
      this.tasks.push(task);
    }
  }

  // task num is the index of the task in the task array. subtask is a boolean
  edittask(tasknum, name, date, priority, desc, subtask) {
    let task;
    if (subtask) {
      task = this.subtasks[tasknum];
    } else { task = this.tasks[tasknum]; }
    task.name = name;
    task.date = new Date(date);
    task.desc = desc;
    task.priority = priority;

    // change specific task in array for different needs
  }

  // 86400000 is the milliseconds in a day
  // streak is incremented if both the last task and this task are due less that a day ago
  // the streak is reset if an overdue task is completed
  completetask(task) {
    if (this.lastcompletedtaskdate != null) {
      const datediff = this.date.valueOf() - this.lastcompletedtaskdate;
      const curdatediff = this.date.valueOf() - task.date.valueOf();
      if (datediff < 86400000 && curdatediff < 86400000) { // verify task is not overdue
        this.streak++;
        this.lastcompletedtaskdate = task.date;
      } else { // if we complete an overdue task
        this.streak = 0;
        this.lastcompletedtaskdate = null;
        this.removetask(task);
        return;
      }
    } else { // if the current completed task is not overdue
      if (task.date.getFullYear() < maintodolist.date.getFullYear()
      || task.date.getMonth() < maintodolist.date.getMonth()
      || task.date.getDay() < maintodolist.date.getDay()) {
        this.removetask(task);
        return;
      }
      this.streak++;
      this.lastcompletedtaskdate = task.date;
    }

    if (this.streak !== 0) {
      this.points += (this.streak);
    } else {
      this.points++;
    }

    this.removetask(task);
  }

  removetask(task) {
    if (task.parenttask === undefined) {
      this.tasks.splice(this.tasks.indexOf(task), 1);
    } else {
      task.parenttask.removesubtask(task);
      this.subtasks.splice(this.subtasks.indexOf(task), 1);
    }
  }

  // sort types:
  // A-Z: sort by task name lexographically, uses ascii codes
  // Z-A: sort by task name reverse lexographically,  uses ascii codes
  // 01/1-100: sort by task priority lowest first
  // 10/100-1: sort by task priority highest first
  // 1/11/1111: sort by task date: earliest first
  sortAZ() {
    this.tasks.sort((a, b) => (strToInt(a.name) - strToInt(b.name)));
    maintodolist.sorttype = 'A-Z';
  }

  sortZA() {
    this.tasks.sort((a, b) => (strToInt(b.name) - strToInt(a.name)));
    maintodolist.sorttype = 'Z-A';
  }

  sort01() {
    this.tasks.sort((a, b) => (a.priority - b.priority));
    maintodolist.sorttype = '1-100';
  }

  sort10() {
    this.tasks.sort((a, b) => (b.priority - a.priority));
    maintodolist.sorttype = '100-1';
  }

  sortDate() {
    this.tasks.sort((a, b) => (a.date - b.date));
    maintodolist.sorttype = '1/11/1111';
  }

  resetPoints() {
    this.points = 0;
  }

  changeTopXtoshow(int) {
    this.showTopXhome = int;
  }

  resetStreak() {
    this.streak = 0;
  }

  changeUsername(name) {
    this.username = name;
  }

  increaseS() {
    this.streak++;
  }

  decreaseS() {
    this.streak--;
  }

  increaseP() {
    this.points++;
  }

  decreaseP() {
    this.points--;
  }
}
console.log('controller loaded');

// setup variables and objects
const addtaskB = document.getElementById('addtask_button');
const deletetaskB = document.getElementById('deletetask_button');
const clearinputB = document.getElementById('clearinput_button');
const applybgB = document.getElementById('apply_background_setting');
const usernameB = document.getElementById('username_button');
const saveB = document.getElementById('save_button');
const saveAllB = document.getElementById('saveAll_button');
const loadB = document.getElementById('load_button');
const pointResetB = document.getElementById('point_reset_button');
const streakResetB = document.getElementById('streak_reset_button');
const cheatB = document.getElementById('adminUser');
const fontB = document.getElementById('font_button');
const fontColorB = document.getElementById('font_color_button');
const topXSetting = document.getElementById('top_X_results_button');
const sortBs = document.querySelectorAll('[data-sortB]');
const taskdisplay = document.getElementById('tasks');
const pointsdisplay = document.getElementById('points');
const streakdisplay = document.getElementById('streak');
const homepagetaskdisplay = document.getElementById('homepage_tasks');
const topRs = document.getElementById('topresults');
const name = document.getElementById('name_input');
const date = document.getElementById('date_input');
const priority = document.getElementById('priority_input');
const desc = document.getElementById('desc_input');
const datedisplay = document.getElementById('currentdate');
const cheatTab = document.getElementById('menu5');
const cheatIncreasePoint = document.getElementById('cheat_increase_points');
const cheatDecreasePoint = document.getElementById('cheat_decrease_points');
const cheatIncreaseStreak = document.getElementById('cheat_increase_streak');
const cheatDecreaseStreak = document.getElementById('cheat_decrease_streak');

let maintodolist = new List();
let curtask = -1;
let addingsubtask = false;
let editsubtask = false;

// define controller functions

// displays all tasks by creating the html for them
function displayTasks() {
  sortTasks();
  taskdisplay.innerHTML = '';
  let tempnum = 0;
  for (const t of maintodolist.tasks) {
    const TASK = createTaskHTML(t, tempnum, false);
    tempnum++;
    for (const s of t.subtasks) {
      const SUB = createTaskHTML(s, tempnum, true);
      TASK.appendChild(SUB);
      tempnum++;
    }
    taskdisplay.appendChild(TASK);
  }
  pointsdisplay.innerText = maintodolist.points;
  streakdisplay.innerText = maintodolist.streak;
  displayHomePageTasks();
}

// helper function to create the html for tasks
function createTaskHTML(t, tempnum, subtask, onhomepage) {
  const TASK = document.createElement('DIV');

  // change task look depending on type
  if (subtask) {
    TASK.className = 'ui secondary segment';
  } else if (t.date.getFullYear() < maintodolist.date.getFullYear()) {
    TASK.className = 'ui raised red segment';
  } else if (t.date.getMonth() < maintodolist.date.getMonth()) {
    TASK.className = 'ui raised red segment';
  } else if (t.date.getDay() < maintodolist.date.getDay()) {
    TASK.className = 'ui raised red segment';
  } else { TASK.className = 'ui raised segment'; }
  TASK.id = `task${tempnum}`;
  const NAME = document.createElement('DIV');
  const DATE = document.createElement('DIV');
  const PRIORITY = document.createElement('DIV');
  const sect = document.createElement('DIV');
  const COMPLETE_B = document.createElement('BUTTON');
  const DESC = document.createElement('DIV');

  sect.className = 'ui horizontal segments';
  NAME.className = 'ui segment';
  NAME.innerText = t.name;
  DATE.className = 'ui segment';
  DATE.innerText = t.date.toLocaleDateString();
  PRIORITY.className = 'ui segment';
  PRIORITY.innerText = t.priority;
  DESC.className = 'ui raised segment';
  DESC.innerText = t.desc;

  COMPLETE_B.className = 'ui button';
  COMPLETE_B.id = `completetask${tempnum}`;
  COMPLETE_B.innerText = 'Complete Task';

  // add listeners to buttons

  COMPLETE_B.addEventListener('click', completeTask.bind(this, t));

  sect.appendChild(NAME);
  sect.appendChild(DATE);
  sect.appendChild(PRIORITY);
  TASK.appendChild(sect);
  TASK.appendChild(DESC);
  TASK.appendChild(COMPLETE_B);

  if (!onhomepage) {
    const EDIT_B = document.createElement('BUTTON');
    EDIT_B.className = 'ui button';
    EDIT_B.id = `edittask${tempnum}`;
    EDIT_B.innerText = 'Edit Task';
    EDIT_B.addEventListener('click', editTask.bind(this, t));
    TASK.appendChild(EDIT_B);
  }

  if (!subtask && !onhomepage) {
    const ADDSUB_B = document.createElement('BUTTON');
    ADDSUB_B.className = 'ui button';
    ADDSUB_B.id = `addsubtask${tempnum}`;
    ADDSUB_B.innerText = 'Add Subtask';
    ADDSUB_B.addEventListener('click', addSubTask.bind(this, t));
    TASK.appendChild(ADDSUB_B);
  }
  return TASK;
}

// function to reset task editor functionality and look
function clearInput() {
  name.value = '';
  date.value = '';
  priority.value = 0;
  desc.value = '';
  document.getElementById('task_editor_title').innerText = 'Inputs for a new task';
  curtask = -1;
  addtaskB.innerText = 'Add Task';
  addingsubtask = false;
  editsubtask = false;
}

// if not editing a task add a new task
// cases are addsubtask/editsubtask/edittask/addtask
function addTask() {
  if (addingsubtask) {
    maintodolist.addtask(name.value, date.value, priority.value, desc.value, curtask);
  } else if (editsubtask && curtask !== -1) {
    maintodolist.edittask(curtask, name.value, date.value, priority.value, desc.value, true);
  } else if (curtask !== -1) {
    maintodolist.edittask(curtask, name.value, date.value, priority.value, desc.value);
  } else {
    maintodolist.addtask(name.value, date.value, priority.value, desc.value);
  }
  displayTasks();
  clearInput();
}

// changes task editor title and current task
function addSubTask(task) {
  curtask = maintodolist.tasks.indexOf(task);
  addingsubtask = true;
  document.getElementById('task_editor_title').innerText = `Adding subtask to ${task.name}`;
  addtaskB.innerText = 'Add Subtask';
}

function displayHomePageTasks() {
  homepagetaskdisplay.innerHTML = '';
  let tempnum = 0;

  for (let i = 0; i < Math.min(maintodolist.showTopXhome, maintodolist.tasks.length); i++) {
    const t = maintodolist.tasks[i];
    const TASK = createTaskHTML(t, tempnum, false, true);
    tempnum++;
    for (const s of t.subtasks) {
      const SUB = createTaskHTML(s, tempnum, true, true);
      TASK.appendChild(SUB);
      tempnum++;
    }
    homepagetaskdisplay.appendChild(TASK);
  }
}

function editTask(task) {
  if (task.parenttask !== undefined) {
    curtask = maintodolist.subtasks.indexOf(task);
    editsubtask = true;
  } else { curtask = maintodolist.tasks.indexOf(task); }

  name.value = task.name;
  date.value = task.date.toLocaleDateString('en-CA');
  priority.value = task.priority;
  desc.value = task.desc;
  document.getElementById('task_editor_title').innerText = `editing task ${task.name}`;
  addtaskB.innerText = `reconfigure ${task.name}`;
}

// if a task is selected set the task to either a subtask or task and delete it
function deleteTask() {
  if (curtask !== -1) {
    let task;
    if (editsubtask) {
      task = maintodolist.subtasks[curtask];
    } else {
      task = maintodolist.tasks[curtask];
    }
    maintodolist.removetask(task);
    curtask = -1;
  }
  displayTasks();
}

// gets passed a button html object and uses the inner text to determine the sort type
function sortTasks(button) {
  let sort;
  // if sort was called by a sort button use its value otherwise use the List's current sort type
  if (button === undefined) {
    sort = maintodolist.sorttype;
  } else { sort = button.innerHTML; }

  switch (sort) {
    case 'A-Z':
      maintodolist.sortAZ();
      break;
    case 'Z-A':
      maintodolist.sortZA();
      break;
    case '1-100':
      maintodolist.sort01();
      break;
    case '100-1':
      maintodolist.sort10();
      break;
    case '1/11/1111':
      maintodolist.sortDate();
      break;
    default:
      console.log('THIS SHOULDNT PRINT, YOUR SORT BUTTON EVENTS ARE MESSED UP');
  }

  // displaytasks() calls sorttasks() with no argument this would loop infinitly without if statment
  if (button !== undefined) { displayTasks(); }
}

// complete task functionality handled by List class
function completeTask(task) {
  maintodolist.completetask(task);
  displayTasks();
}

function Load() {
  const list = JSON.parse(localStorage.getItem(`${maintodolist.username.toLowerCase()}todolist`));
  if (typeof list === 'object') {
    maintodolist.loadList(list);
  } else {
    console.log('your save doesnt exist');
    return;
  }

  document.body.style.fontFamily = maintodolist.font;
  document.body.style.color = maintodolist.fontColor;
  document.body.style.backgroundColor = maintodolist.UIColor;
  displayTasks();
}

// saves current list to local storage
function Save() {
  if (typeof (Storage) !== 'undefined') {
    localStorage.setItem(`${maintodolist.username.toLowerCase()}todolist`, JSON.stringify(maintodolist));
  } else {
    console.log('No local storage support');
  }
}
function saveAllSettings() {
  changeUiColor();
  changeFontColor();
  changeFont();
  changeUsername();
  changeTopXHomePage();
}
function changeUsername() {
  maintodolist.changeUsername(document.getElementById('username_input').value);
  document.getElementById('username_input').value = '';
  document.getElementById('usergreeting').innerText = `Hello ${maintodolist.username}`;
}
function resetPoints() {
  maintodolist.resetPoints();
  pointsdisplay.innerText = maintodolist.points;
}
function resetStreak() {
  maintodolist.resetStreak();
  pointsdisplay.innerText = maintodolist.streak;
}
function changeTopXHomePage() {
  const setting = document.getElementById('top_X_results_setting').value;
  if (setting === '') {
    return;
  }
  maintodolist.changeTopXtoshow(setting);
  topRs.innerText = `These are your top ${setting} tasks`;
}
function changeUiColor() {
  const setting = document.getElementById('background_setting').value;
  document.body.style.backgroundColor = setting;
  maintodolist.UIColor = setting;
}
function changeFont() {
  const setting = document.getElementById('font_setting').value;
  document.body.style.fontFamily = setting;
  maintodolist.font = setting;
}
function changeFontColor() {
  const setting = document.getElementById('font_color_setting').value;
  document.body.style.color = setting;
  maintodolist.fontColor = setting;
}
function adminCheatMode() {
  const string = document.getElementById('cheatPassword').value;
  if (string === '1234567890') {
    cheatTab.style.visibility = 'visible';
    document.getElementById('cheatPassword').value = '';
  } else {
    cheatTab.style.visibility = 'hidden';
  }
  document.getElementById('cheatPassword').value = '';
}
function cheatIncreasePs() {
  maintodolist.increaseP();
  pointsdisplay.innerText = maintodolist.points;
}
function cheatDecreasePs() {
  maintodolist.decreaseP();
  pointsdisplay.innerText = maintodolist.points;
}
function cheatIncreaseS() {
  maintodolist.increaseS();
  pointsdisplay.innerText = maintodolist.streak;
}

function cheatdecreaseS() {
  maintodolist.decreaseS();
  pointsdisplay.innerText = maintodolist.streak;
}

// helper function since JS doesnt recognize strings as ints in any easy way
function strToInt(s) {
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    sum += s.charCodeAt(i);
  }
  return sum;
}

// attach listeners
addtaskB.addEventListener('click', addTask);
deletetaskB.addEventListener('click', deleteTask);
clearinputB.addEventListener('click', clearInput);
applybgB.addEventListener('click', changeUiColor);
usernameB.addEventListener('click', changeUsername);
loadB.addEventListener('click', Load);
saveB.addEventListener('click', Save);
saveAllB.addEventListener('click', saveAllSettings);
pointResetB.addEventListener('click', resetPoints);
streakResetB.addEventListener('click', resetStreak);
fontB.addEventListener('click', changeFont);
fontColorB.addEventListener('click', changeFontColor);
topXSetting.addEventListener('click', changeTopXHomePage);

cheatB.addEventListener('click', adminCheatMode);
cheatIncreasePoint.addEventListener('click', cheatIncreasePs);
cheatDecreasePoint.addEventListener('click', cheatDecreasePs);
cheatIncreaseStreak.addEventListener('click', cheatIncreaseS);
cheatDecreaseStreak.addEventListener('click', cheatdecreaseS);

for (const T of sortBs) {
  T.addEventListener('click', sortTasks.bind(this, T));
}

// other setup
datedisplay.innerText = maintodolist.date.toLocaleDateString();
