document.addEventListener("DOMContentLoaded", function () {
    const messageContainer = document.querySelectorAll("#django-messages .msg");
  
    messageContainer.forEach(function (msgDiv) {
      const tag = msgDiv.dataset.tag;
      const message = msgDiv.textContent;
  
      if (tag === "success") {
        document.querySelector('.message-success').textContent = message;
        document.querySelector('.message-success').style.display = 'block';
        console.log('Success:', message);
      } else if (tag === "error") {
        document.querySelector('.message-error').textContent = message;
        document.querySelector('.message-error').style.display = 'block';
        console.log('Error:', message);
      }
    });
  });
  