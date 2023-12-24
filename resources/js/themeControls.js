
const themeControls = (function() {


  let primaryFontElements;
  let secondaryFontElements;
  let fontControls;
  let fontLabel;


  let dropDownMenus = [];


  let colorThemeActive = false;
  let toggleSwitches = [];
  let themeElements = {};


  const rootStyle = getComputedStyle(document.documentElement);
  const transitionTiming = rootStyle.getPropertyValue('--transition-delay').slice(0, -1);

  function init() {

    loadFontElements();


    // -----------------------------------------------------
    let menus = document.querySelectorAll('.dropdown-menu');
    menus.forEach(element => {
      let menuHeader;
      let menuContents;
      let childElements = element.children;


      for(let i = 0; i < childElements.length; i++) {
        let childClasses = childElements[i].classList;
        for(let j = 0; j < childClasses.length; j++) {
          if(childClasses[j] === "dropdown-menu-header") {
            menuHeader = childElements[i];
          };
          if(childClasses[j] === "dropdown-menu-contents") {
            menuContents = childElements[i];
          };
        };
      };

      dropDownMenus.push(new Menu(element, menuHeader, menuContents));
    });
    // -----------------------------------------------------


    // -----------------------------------------------------
    let toggles = document.querySelectorAll('.toggle');
    toggles.forEach(element => {
      let toggleButton;
      let childElements = element.children;
      let toggleContainer = element.parentElement;
      let svgElement = element.nextElementSibling;
      for(let i = 0; i < childElements.length; i++) {
        let childClasses = childElements[i].classList;
        for(let j = 0; j < childClasses.length; j++) {
          if(childClasses[j] === "toggle-switch") {
            toggleButton = childElements[i];
          };
        };
      };


      toggleSwitches.push(new ToggleControl(toggleContainer, element, toggleButton, svgElement));
    });
    // -----------------------------------------------------


    loadThemeElements();


    fontControls.forEach(element => {
      element.addEventListener('click', function() {
        hideFontMenu(element.parentElement);
        changeStyle(element);
      });
    });

    toggleSwitches.forEach(item => {
      item.parent.addEventListener('click', function() {
        item.switchToggle();
      })
    });

    dropDownMenus.forEach(menuContainer => {
      menuContainer.element.addEventListener('click', function() {
        showFontMenu(menuContainer.contents);
      });
      menuContainer.element.addEventListener('mouseleave', function() {
        hideFontMenu(menuContainer.contents);
      });
      menuContainer.contents.addEventListener('mouseleave', function() {
        hideFontMenu(menuContainer.contents);
      });
      menuContainer.element.addEventListener('mouseenter', function() {
        stopTimeout(menuContainer.contents);
      });
      menuContainer.contents.addEventListener('mouseenter', function() {
        stopTimeout(menuContainer.contents);
      });

    });


    let colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if(colorMode) {

      toggleSwitches[0].switchToggle();
    }

    loadThemeState();


  };



  function Menu(element, header, contents) {
    this.element = element;
    this.header = header;
    this.contents = contents;
  };

  function ToggleControl(parent, element, toggleButton, svgElement) {
    this.parent = parent;
    this.element = element;
    this.toggleButton = toggleButton;
    this.svg = svgElement;
  };

  ToggleControl.prototype.switchToggle = function() {
    let style = this.toggleButton.style.transform;
    if(!style) {
      colorThemeActive = true;
      this.element.style.backgroundColor = 'var(--active-lavender)';
      this.svg.childNodes[0].style.stroke = 'var(--active-lavender)';
      this.toggleButton.style.transform = 'translateX(125%)';
    } else {
      colorThemeActive = false;
      this.element.style.backgroundColor = '';
      this.svg.childNodes[0].style.stroke = '';
      this.toggleButton.style.transform = '';
    }
    loadThemeState();
  };

  function loadFontElements() {
    primaryFontElements = document.querySelectorAll('.font-primary');
    secondaryFontElements = document.querySelectorAll('.font-secondary');
    fontControls = document.querySelectorAll('[data-font]');
    fontLabel = document.getElementById('font-select-label').childNodes[0];
  };

  function loadThemeElements() {
    themeElements.background = [];
    themeElements.boxShadow = [];
    themeElements.textInput = [];

    document.querySelectorAll('.bg-theme-color').forEach(element => {
      themeElements.background.push(element);
    });
    document.querySelectorAll('.box-shadow').forEach(element => {
      themeElements.boxShadow.push(element);
    });
    document.querySelectorAll('input[type="text"]').forEach(element => {
      themeElements.textInput.push(element);
    });

  };

  function stopTimeout(elem) {
    if(elem.timeoutId) {
      clearTimeout(elem.timeoutId);
    }
  };

  function toggleHide(elem) {
    elem.classList.toggle('hidden');
  };

  function showFontMenu(contents) {
    for(let i = 0; i < contents.classList.length; i++) {
      if(contents.classList[i] === 'hidden') {
        toggleHide(contents);
        return;
      }
    }
  };

  function hideFontMenu(contents) {
    if(contents.classList.length > 0) {
      for(let i = 0; i < contents.classList.length; i++) {
        if(contents.classList[i] === 'hidden') {
          return;
        }
      }
    }
    if(contents.timeoutId) {
      clearTimeout(contents.timeoutId);
    }
    contents.timeoutId = setTimeout(() => {
      toggleHide(contents);
    }, parseFloat(transitionTiming) * 1000);
  };

  function loadThemeState() {
    if(colorThemeActive) {
      themeElements.background.forEach(element => {
        element.classList.add('bg-dark');
      });
      themeElements.boxShadow.forEach(element => {
        element.classList.add('box-shadow-dark');
      });
      themeElements.textInput.forEach(element => {
        element.classList.add('text-input-dark');
      });
    } else {
      themeElements.background.forEach(element => {
        element.classList.remove('bg-dark');
      });
      themeElements.boxShadow.forEach(element => {
        element.classList.remove('box-shadow-dark');
      });
      themeElements.textInput.forEach(element => {
        element.classList.remove('text-input-dark');
      });
    }

  };

  function changeStyle(fontSelector) {
    let font = fontSelector.dataset.font
    primaryFontElements.forEach(element => {
      element.style.fontFamily = `${font}`;
    });

    // Specific style changes for the language elements based on font selected
    switch(font) {
      case 'var(--sans-serif)':
        secondaryFontElements.forEach(element => {
          element.style.fontWeight = '700';
          element.style.transform = 'translateY(-50%) skew(-10deg)';
        });
        break;
      case 'var(--serif)':
        secondaryFontElements.forEach(element => {
          element.style.fontWeight = '400';
          element.style.transform = 'translateY(-50%) skew(0deg)';
        });
        break;
      case 'var(--mono)':
        secondaryFontElements.forEach(element => {
          element.style.fontWeight = '700';
          element.style.transform = 'translateY(-50%) skew(0deg)';
        });
        break;
      default:
        console.log('Error selected font for secondary font elements');
    };

    fontLabel.textContent = fontSelector.innerHTML;
  };

  function loadFontState() {
    const fontSelect = document.getElementById('font-select-label');
    const fontText = fontSelect.innerText.trim();
    fontControls.forEach(element => {
      if(element.innerHTML === fontText) {
        changeStyle(element);
        return;
      }
    });
  };

  // Initialize the state and functionality of the UI
  init();

  return {
    loadFontElements,
    loadFontState,
    loadThemeElements,
    loadThemeState
  };

})();

export default themeControls;