import "./popup.css";
// 獲取 `<dialog>` 元素
const listButton = document.getElementById('listButton') as HTMLDialogElement;

// 開啟對話框
function openDialog(): void {
  if (listButton) {
    listButton.showModal(); // 使用原生方法顯示對話框
  } else {
    console.error('Dialog element not found.');
  }
}

// 關閉對話框
function closeDialog(): void {
  if (listButton) {
    listButton.close(); // 使用原生方法關閉對話框
  } else {
    console.error('Dialog element not found.');
  }
}

// 綁定按鈕事件
const openButton = document.getElementById('openButton') as HTMLButtonElement;
const closeButton = document.getElementById('closeButton') as HTMLButtonElement;

if (openButton && closeButton) {
  openButton.addEventListener('click', openDialog);
  closeButton.addEventListener('click', closeDialog);
} else {
  console.error('Button elements not found.');
}
