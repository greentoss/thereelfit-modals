document.addEventListener("DOMContentLoaded", function () {
    const configUrl = "overlay/config.json"; // URL to your configuration file
    const video = document.getElementById("video");
  
    fetch(configUrl)
      .then(response => response.json())
      .then(config => initializeTool(config));
  
    function initializeTool(config) {
      // Add invisible overlay over video  
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      overlay.id = "overlay";
      video.parentElement.style.position = 'relative';
      video.parentElement.appendChild(overlay);
  
      // Add modal that will popup  
      const modal = document.createElement("div");
      modal.classList.add("popup-modal");
      modal.id = "popup-modal";
      overlay.appendChild(modal);
  
      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
      modalContent.innerHTML = `
        <span class="close" id="close">&times;</span>
        <iframe class="modal-iframe" src="" frameborder="0"></iframe>
      `;
      modal.appendChild(modalContent);
  
      const iframe = modalContent.querySelector(".modal-iframe");
      const closeBtn = modalContent.querySelector("#close");
  
      let isModalOpen = false;
      let lastTimestamp = -1;
  
      // Function to open modal
      function openModal(link) {
        pauseVideo();
        iframe.src = link;
        modal.style.display = "block";
        modalContent.classList.add('show-modal');
        modalContent.classList.remove('hide-modal');
        overlay.style.background = 'rgba(0, 0, 0, 0.0)';
        isModalOpen = true;
      }
  
      // Function to close modal
      function closeModal() {
        modalContent.classList.remove('show-modal');
        modalContent.classList.add('hide-modal');
        setTimeout(() => {
          modal.style.display = "none";
          playVideo();
          overlay.style.background = 'rgba(0, 0, 0, 0)';
        }, 1000); // Match the duration of unfoldOut animation
        isModalOpen = false;
      }
  
      // Function to toggle modal
      function toggleModal(link) {
        if (isModalOpen) {
          closeModal();
        } else {
          openModal(link);
        }
      }
  
      // Event listeners
      overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
          toggleModal();
        }
      });
  
      closeBtn.addEventListener("click", closeModal);
  
      // Throttle function to limit the number of times `timeupdate` event is handled
      function throttle(fn, limit) {
        let lastFunc;
        let lastRan;
        return function() {
          const context = this;
          const args = arguments;
          if (!lastRan) {
            fn.apply(context, args);
            lastRan = Date.now();
          } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
              if ((Date.now() - lastRan) >= limit) {
                fn.apply(context, args);
                lastRan = Date.now();
              }
            }, limit - (Date.now() - lastRan));
          }
        };
      }
  
      video.addEventListener("timeupdate", throttle(function () {
        const currentTime = Math.floor(video.currentTime);
        if (currentTime !== lastTimestamp) {
          const timestamp = config.timestamps.find(ts => ts.time === currentTime);
          if (timestamp) {
            openModal(timestamp.link);
            lastTimestamp = currentTime;
          }
        }
      }, 1000)); // Throttle the event handler to run at most once per second
  
      function pauseVideo() {
        video.pause();
      }
  
      function playVideo() {
        video.play();
      }
    }
  });