
// 1. Notification permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}
const today = new Date();
const fixedDate = today.toLocaleDateString("fa-IR"); // تاریخ ثابت (امروز)
const weekdays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

// creat and push weekday name and date 
const days = [];
for (let i = 0; i < 7; i++) {
  let d = new Date();
  d.setDate(d.getDate() + i);
  const weekdayName = weekdays[d.getDay()]; // نام روز هفته
  days.push(weekdayName); // فقط نام روز هفته ذخیره می‌شود
}
const weekdaySpan = document.getElementById('currentWeekday');
const dateSpan = document.getElementById('currentDay');
let classData = JSON.parse(localStorage.getItem("classData")) || [];
let currentDayIndex = 0;
weekdaySpan.textContent = `${days[currentDayIndex]} `;
dateSpan.textContent = `${fixedDate} :تاریخ`;

// 3. page object
const datePicker = document.getElementById("datePicker");
const datePickerBtn = document.getElementById("datePickerBtn");
const prevDayBtn = document.getElementById("prevDay");
const nextDayBtn = document.getElementById("nextDay");
const classListEl = document.getElementById("classList");

const addClassBtn = document.getElementById("addClassBtn");
const openSidebar = document.getElementById("openSidebar");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const themeToggle = document.getElementById("themeToggle");
const clearAllBtn = document.getElementById("clearAll");

const addClassModal = document.getElementById("addClassModal");
const addClassTitle = document.getElementById("addClassTitle");
const inputClassName = document.getElementById("inputClassName");
const inputTeacher = document.getElementById("inputTeacher");
const inputTime = document.getElementById("inputTime");
const inputLocation = document.getElementById("inputLocation");
const saveClassBtn = document.getElementById("saveClass");
const closeAddClassModal = document.getElementById("closeAddClassModal");

const detailModal = document.getElementById("classDetailModal");
const detailClassName = document.getElementById("detailClassName");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const detailTaskList = document.getElementById("detailTaskList");
const detailTaskInput = document.getElementById("detailTaskInput");
const detailTaskDate = document.getElementById("detailTaskDate");
const saveDetailTask = document.getElementById("saveDetailTask");
const closeDetailModal = document.getElementById("closeDetailModal");


// 4. function
function saveToStorage() {
  localStorage.setItem("classData", JSON.stringify(classData));
}

function updateHeader() {
  currentDayEl.textContent = days[currentDayIndex];
}

function renderClasses() {
  classListEl.innerHTML = "";
  const day = days[currentDayIndex];
  if (!classData[day]) classData[day] = [];
  classData[day].forEach((cls, i) => {
    const card = document.createElement("div");
    card.className = "class-card";
    card.innerHTML = `
      <div>${cls.name}</div>
      <div>${cls.teacher}</div>
      <div>${cls.time}</div>
      <div>${cls.location}</div>
      <button class="btn-edit" title="ویرایش"><img src="./pictures/edit.svg" alt="" style="height: 20px; width: auto;"></button>
      <button class="btn-delete" title="حذف"><img class="icon" src="./pictures/delete.svg" alt="" style="height: 20px; width: auto;"></button>
      <button class="btn-detail" title="جزئیات"><img class="icon"src="./pictures/more.svg" alt="" style="height: 30px; width: auto;"></button>
    `;
    card.querySelector(".btn-edit").onclick = (e) => {
      e.stopPropagation();
      openAddModal(cls);
    };
    card.querySelector(".btn-delete").onclick = (e) => {
      e.stopPropagation();
      classData[day].splice(i, 1);
      saveToStorage();
      renderClasses();
    };
    card.querySelector(".btn-detail").onclick = (e) => {
      e.stopPropagation();
      openDetailModal(cls);
    };
    classListEl.appendChild(card);
  });
}

function openAddModal(cls = null) {
  selectedClass = cls;
  addClassTitle.textContent = cls ? "ویرایش کلاس" : "افزودن کلاس جدید";
  inputClassName.value = cls?.name || "";
  inputTeacher.value = cls?.teacher || "";
  inputTime.value = cls?.time || "";
  inputLocation.value = cls?.location || "";
  addClassModal.classList.remove("hidden");
}

function closeAddModal() {
  addClassModal.classList.add("hidden");
}

function openDetailModal(cls) {
  selectedClass = cls;
  detailClassName.textContent = cls.name;
  renderFileList();
  renderTaskList();
  detailModal.classList.remove("hidden");
}

function closeDetail() {
  detailModal.classList.add("hidden");
}

function renderFileList() {
  fileList.innerHTML = "";
  selectedClass.files ??= [];
  selectedClass.files.forEach((file, i) => {
    const li = document.createElement("li");
    li.textContent = file.name;
    const delBtn = document.createElement("button");
    delBtn.innerHTML = `<img class="icon" src="./pictures/close-circle-svgrepo-com.svg" alt="" style="height: 20px; width: auto;">`;
    delBtn.onclick = () => {
      selectedClass.files.splice(i, 1);
      saveToStorage();
      renderFileList();
    };
    li.appendChild(delBtn);
    fileList.appendChild(li);
  });
}

function renderTaskList() {
  detailTaskList.innerHTML = "";
  selectedClass.tasks ??= [];
  selectedClass.tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.textContent = `${task.text} - ${new Date(task.date).toLocaleString("fa-IR")}`;
    const delBtn = document.createElement("button");
    delBtn.innerHTML = `<img class="icon" src="./pictures/delete.svg" alt="" style="height: 20px; width: auto;">`;
    delBtn.onclick = () => {
      selectedClass.tasks.splice(i, 1);
      saveToStorage();
      renderTaskList();
    };
    li.appendChild(delBtn);
    detailTaskList.appendChild(li);
  });
}
 // check notification
function checkTasksForNotifications() {
  const now = new Date();
  const notifyIntervals = [
    { label: "۲۴ ساعت", ms: 24 * 60 * 60 * 1000 },
    { label: "۱۲ ساعت", ms: 12 * 60 * 60 * 1000 },
    { label: "۶ ساعت", ms: 6 * 60 * 60 * 1000 },
    { label: "۱ ساعت", ms: 1 * 60 * 60 * 1000 },
    { label: "۳۰ دقیقه", ms: 30 * 60 * 1000 },
    { label: "۱۵ دقیقه", ms: 15 * 60 * 1000 },
    { label: "۱ دقیقه", ms: 1 * 60 * 1000 },
  ];
  
  for (const day in classData) {
    for (const cls of classData[day]) {
      if (!cls.tasks) continue;

      for (const task of cls.tasks) {
        const taskTime = new Date(task.date);
        const diff = taskTime - now;
        if (!task.notified) task.notified = {};

        for (const interval of notifyIntervals) {
          const range = 30 * 1000; 
          if (!task.notified[interval.ms] && Math.abs(diff - interval.ms) < range) {
            if (Notification.permission === "granted") {
              new Notification(`یادآوری - ${interval.label} مانده`, {
                body: `${cls.name} - ${task.text}`,
                icon: "icons/icon-192.png"
              });
            }
            task.notified[interval.ms] = true;
          }
        }
      }
    }
  }

  saveToStorage();
}
setInterval(checkTasksForNotifications, 60000); 

// 5. events
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    document.getElementById("splash-screen").style.display = "none";
    document.getElementById("main-app").style.display = "block";
  }, 2500); // تا وقتی تایپ تموم شه
});

prevDayBtn.onclick = () => {
  if (currentDayIndex > 0) {
    currentDayIndex--;
    weekdaySpan.textContent = ` ${days[currentDayIndex]} `;
    updateHeader();
    renderClasses();
  }
};
nextDayBtn.onclick = () => {
  if (currentDayIndex < days.length - 1) {
    currentDayIndex++;
    weekdaySpan.textContent = ` ${days[currentDayIndex]} `;
    updateHeader();
    renderClasses();
  }
};
datePickerBtn.onclick = () => datePicker.click();
datePicker.onchange = () => {
  const chosen = new Date(datePicker.value).toLocaleDateString("fa-IR");
  const index = days.indexOf(chosen);
  if (index !== -1) {
    currentDayIndex = index;
    updateHeader();
    renderClasses();
  }
};

addClassBtn.onclick = () => openAddModal();
closeAddClassModal.onclick = () => closeAddModal();
saveClassBtn.onclick = () => {
  const newClass = {
    name: inputClassName.value,
    teacher: inputTeacher.value,
    time: inputTime.value,
    location: inputLocation.value,
    files: selectedClass?.files || [],
    tasks: selectedClass?.tasks || []
  };
  const day = days[currentDayIndex];
  if (!classData[day]) classData[day] = [];
  if (selectedClass) {
    const index = classData[day].indexOf(selectedClass);
    classData[day][index] = newClass;
  } else {
    classData[day].push(newClass);
  }
  saveToStorage();
  closeAddModal();
  renderClasses();
};

closeDetailModal.onclick = () => closeDetail();
fileInput.onchange = () => {
  const files = Array.from(fileInput.files);
  selectedClass.files ??= [];
  selectedClass.files.push(...files.map(f => ({ name: f.name })));
  saveToStorage();
  renderFileList();
};

saveDetailTask.onclick = () => {
  const text = detailTaskInput.value;
  const date = detailTaskDate.value;
  if (!text || !date) return;
  selectedClass.tasks ??= [];
  selectedClass.tasks.push({
    text,
    date: new Date(date).toISOString(),
    notified: {}
  });
  detailTaskInput.value = "";
  detailTaskDate.value = "";
  saveToStorage();
  renderTaskList();

  if (Notification.permission === "granted") {
    new Notification("تسک جدید ثبت شد", {
      body: text,
      icon: "icons/icon-192.png"
    });
  }
};

openSidebar.onclick = () => sidebar.classList.add("visible");
closeSidebar.onclick = () => sidebar.classList.remove("visible");

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
};

clearAllBtn.onclick = () => {
  if (confirm("آیا مطمئن هستید که می‌خواهید تمام داده‌ها پاک شوند؟")) {
    localStorage.removeItem("classData");
    classData = { [days[0]]: [] };
    renderClasses();
  }
};

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

updateHeader();
renderClasses();
