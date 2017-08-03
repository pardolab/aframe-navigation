module.exports = AFRAME.registerComponent('nav-breadcrumbs', {
  schema: {
    width: {type: 'number', default: 1},
    height: {type: 'number', default: 0.2},
    maxCrumbs: {type: 'number', default: 8},
  },

  init: function() {
    this.crumbs = [];
    this.breadcrumbsAmount = 0;                // Current amount of breadcrumbs
    this.breadcrumbOffset = 0.1;               // How far away breadcrumbs are from each other.
    this.breadcrumbHeight = 0.2;

  },
  update: function(oldData) {
    // Resize Crumbs
    this.breadcrumbs = this.getBreadcrumbElements();

    // Sets important values that need to be updated often
    this.updateValue();


    if (oldData.width !== this.data.width) {
      //this.updateBreadcrumbs();
    }

    if (oldData.height !== this.data.height) {
      
    }
  },
  /**
   * 
   * @param {*} label - label to be displayed on the breadcrumb button
   * @param {*} panelName - The exact panel name (reference panel.js). Acts as a link when clicked.
   */
  addBreadCrumb: function(label, panelName) {

    this.updateValue();
    console.log('breadcrumb: ', label);
    
    let el = document.createElement('a-entity');
    el.setAttribute('nav-button', {
      width: this.breadcrumbWidth,
      height: this.breadcrumbHeight,
      label: label,
      color: '#555588',
      textWidth: 2,
      name: 'link',
      link: panelName
    });

    console.log('bread width:', this.breadcrumbWidth, 'offset', this.breadcrumbOffset, 'initPos', this.breadcrumbInitPosOffset);
    let nextXPos = this.getNextXPosByIndex(this.breadcrumbsAmount, this.breadcrumbWidth, this.breadcrumbOffset, this.breadcrumbInitPosOffset);
    let height = this.data.height;

    el.setAttribute('position', `${nextXPos} ${height + this.breadcrumbHeight} 0`);
    el.setAttribute('id', this.getNewId(this.breadcrumbsAmount));
    this.breadcrumbsAmount += 1;

    // Inserts a crumb object
    this.crumbs.push({
      label: label,
      panelName: panelName
    });

    this.el.appendChild(el);
  },
  
  updateBreadcrumbs: function() {
    //  this.breadcrumbs.forEach((el, i) => {
    //     el.setAttribute('ui-push-button', {
    //       width: this.breadcrumbWidth,
    //       height: this.breadcrumbHeight
    //     });
    //     let xPos = getNextXPosByIndex(i, this.breadcrumbWidth, this.breadcrumbOffset, this.breadcrumbInitPosOffset);
    //     el.setAttribute('position', `${xPos} 0 0`);
    //  });

    //  console.log('updated breadcrumb', this.breadcrumbs);
  },

  resetBreadcrumbs: function() {
    this.crumbs = [];
    this.breadcrumbsAmount = 0;
  },

  /**
   * Returns new breadcrumb ID
   * Based on breadcrumb amount
   * @param amount - The amount of currently active breadcrumbs
   */
  getNewId: function(amount) {
    return `crumb${this.breadcrumbsAmount.length}`;
  },

  
  getBreadcrumbElements: function(amount) {
    let elementArray = []
    for(let i=0; i<amount; ++i) {
      let el = this.el.querySelector(`#crumb${i}`);
      if (el !== undefined) elementArray.push(el);
    }

    return elementArray;
  },

  
  /**
   * Returns the next X Position
   * @param {*} breadcrumbs - array of active breadcrumb names
   * @param {*} width - breadcrumb width
   * @param {*} offset - breadcrumb offset to another breadcrumb
   * @param {*} initPos - Inital position of all breadcrumbs
   */
  getNextXPos: function(breadcrumbs, width, offset, initPos) {
    let nextPos = breadcrumbs.length * (width + offset) - initPos;
    return nextPos;
  },


  /**
   * Returns the next X Position
   * @param {*} index - indexOfBreadcrumb
   * @param {*} width - breadcrumb width
   * @param {*} offset - breadcrumb offset to another breadcrumb
   * @param {*} initPos - Inital position of all breadcrumbs
   */
  getNextXPosByIndex: function(index, width, offset, initPos) {
    let nextPos = index * (width + offset) - initPos;
    return nextPos;
  },

  updateValue: function() {
    this.breadcrumbWidth = this.data.width / this.data.maxCrumbs;
    let randomOffset = 1.32;
    this.breadcrumbInitPosOffset = (this.data.width / 2) - (this.breadcrumbWidth / 2);
  }
});