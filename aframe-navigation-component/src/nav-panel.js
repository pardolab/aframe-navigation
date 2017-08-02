//let ColorHelper = require('/helper/ColorHelper');

module.exports = AFRAME.registerComponent('nav-panel', {
  multiple: true,
  schema: {
    width: {type: "number", default: 3.0},
    height: {type: "number", default: 1.3},
    opacity: {type: "number", default: 0.8},
    borderOpacity: {type: "number", default: 0.3},
    color: {type: "color", default: "#010101"},
    borderColor: {type: "color", default: "#55eeFF"},
    textColor: {type: "color", default: "#fefefe"},
    label: {type: "string", default: "Panel"},
    name: {type: "string", default: "default"},
    panel: {type: "string", default: "default"},
    active: {type: "boolean", default: "true"},         // This is changed by child components to toggle click events on this panel
    hoverState: {type: "boolean", default: "false"}     // This hover state for this panel
  },
  init: function () {

    // Get parent nav map url
    this.navMapUrl = this.el.parentEl.components['nav-layout'].data.navMapUrl;
    this.id = this.el.getAttribute('id');

// Set View
    this.currentPanel = this.data.panel;
    this.viewMap = undefined;
    let viewMapRequest = this.getViewMap();
    viewMapRequest.end((err, res) => {
      if (err) {console.error('No view map found', err); return}
      
      this.viewMap = res.body;
      this.goToPanel(this.currentPanel);
    });

// SET VAR     
     
    this.initPos = (new THREE.Vector3()).copy(this.el.getAttribute('position'));
    //this.id = uuidv4();
    this.tickIndex = 0;
    this.dragEnable = false;
    this.ctrlInitPos = new THREE.Vector3();
    this.panelInitPos = new THREE.Vector3();
    this.deltaPos = new THREE.Vector3();
    this.updatedPos = new THREE.Vector3();

    this.PUSH_BACK_DISTANCE = -0.02;

    this.initIntersectionPos = new THREE.Vector3();
    this.ctrlAngle = new THREE.Vector3();

    const BUTTON_SEGMENTS = 30;
    const DEPTH = 0.001;
    const borderSize = 0.3;
    const borderDepthOffset = DEPTH + 0.005;

    // Colors
    this.color = new THREE.Color(this.data.color);
    this.borderColor = new THREE.Color(this.data.borderColor);
    this.textColor = new THREE.Color(this.data.textColor);

    
    // All of the controllerElements - Map
    this.controllerElements = new Map();
    this.controllerElements.set('ctrlRight', document.getElementById('ctrlRight'));
    this.controllerElements.set('ctrlLeft', document.getElementById('ctrlLeft'));


    // Set To be Interactive; Able to be detected by the raycaster/controller
    this.el.setAttribute('class', 'interactive');

// SET LAYOUT



    this.geometry = new THREE.BoxBufferGeometry(this.data.width, this.data.height, DEPTH, BUTTON_SEGMENTS);
    // Border
    this.borderGeo = new THREE.EdgesGeometry( this.geometry );


    // Background Material
    this.material = new THREE.MeshBasicMaterial({
      color: `#${this.color.getHexString()}`,
      side: 'double'
      }
    );

    this.material.transparent = true;
    this.material.opacity = this.data.opacity;

    // Border Material
    this.borderMaterial = new THREE.LineBasicMaterial({
        color: `#${this.borderColor.getHexString()}`,
        side: 'double'
      }
    );

    this.borderMaterial.transparent = true;
    this.borderMaterial.opacity = this.data.borderOpacity;


    // Create mesh.
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.borderMesh = new THREE.LineSegments( this.borderGeo, this.borderMaterial);

    this.el.setObject3D('plane', this.mesh);

    
// Text
    this.textEl = document.createElement('a-text');
    this.textEl.setAttribute('value', this.data.label);
    this.textEl.setAttribute('position', `${this.data.width/-2 - 0.04} ${this.data.height/2 + 0.1} ${DEPTH}`);
    this.textEl.setAttribute('align', 'left');

// All Text

    //this.dimText();

// Style event listeners

    this.data.EVENTS = {
      onenter: (e) => {          // When raycaster is on button

        if (!this.el.is('hover')) {
          // Cursor True
          this.el.addState('hover')
          console.log("onEnter");

          console.log("Panel onEnter");
          this.el.setObject3D('border', this.borderMesh);

          this.el.setAttribute('position', {
            x: this.initPos.x,
            y: this.initPos.y,
            z: this.initPos.z + this.PUSH_BACK_DISTANCE
          });

          this.el.emit('onenter', {
            id: this.id,
            name: this.data.name,
            data: this.data,
            target: this.el,
            event: e
          });
          //if (this.textEl) {this.el.appendChild(this.textEl)}
          //this.unDimText();
        }

      },

      // When raycaster is clicked on the button
      onactivate: (e) => {
        if (this.el.is('hover') && !this.el.is('active')) {
          this.el.addState('active');

          this.el.emit('onactivate', {
            id: this.id,
            name: this.data.name,
            data: this.data,
            target: this.el,
            event: e
          });

          let childHovering = this.isHoverOnChild();
          if (childHovering === undefined) {
            console.log("Panel onActivate");
            console.log('hover on children: ', false);
            
          } else {
            this.emitOnChild(childHovering, 'mousedown', e);
          }
        }
      },

      // When raycaster releases the click
      onrelease: (e) => {
        if (this.el.is('hover') && this.el.is('active')) {
          console.log("Panel onRelease");
          this.el.removeState('active');

          this.el.emit('onrelease', {
            id: this.id,
            name: this.data.name,
            data: this.data,
            target: this.el,
            event: e
          });

          // Child Hover
          let childHovering = this.isHoverOnChild();
          if (childHovering) {
            this.emitOnChild(childHovering, 'mouseup', e);
          }
        }
      },

      // When raycaster leaves button
      onleave: (e) => {          

        if (this.el.is('hover')) {
          console.log("Panel onLeave");

          this.el.emit('onleave', {
            id: this.id,
            name: this.data.name,
            data: this.data,
            target: this.el,
            event: e
          });

          try {
            this.el.removeObject3D('border', this.borderMesh);
            this.el.setAttribute('position', this.initPos);
          } catch(e) {
            console.error(e);
          }

          
          // Shrink Border
          if (this.el.is('active')) {this.el.removeState('active')};
          this.el.removeState('hover');
          //this.dimText();
        }
        
      },
    }

    this.addAllEventListeners();

    // Send ready event
    this.el.emit('onready', {
      id: this.id,
      name: this.data.name,
      data: this.data,
      target: this.el
    });
  },
  update: function (oldData) {

  },
  tick: function () {},
  remove: function () {
    this.el.removeObject3D('plane');
    this.el.removeObject3D('border');
    this.removeAllEventListeners();
  },
  pause: function () {},
  play: function () {},
  
  addAllEventListeners: function() {
    // Setup Controller Callbacks

    this.el.addEventListener('mouseup', this.data.EVENTS.onrelease.bind(this));
    this.el.addEventListener('mousedown', this.data.EVENTS.onactivate.bind(this));
    this.el.addEventListener("raycaster-intersected", this.data.EVENTS.onenter.bind(this));
    this.el.addEventListener("raycaster-intersected-cleared", this.data.EVENTS.onleave.bind(this));
  },

  removeAllEventListeners: function() {
    // Setup Controller Callbacks

    this.el.removeEventListener('mouseup', this.data.EVENTS.onrelease.bind(this));
    this.el.removeEventListener('mousedown', this.data.EVENTS.onactivate.bind(this));
    this.el.removeEventListener("raycaster-intersected", this.data.EVENTS.onenter.bind(this));
    this.el.removeEventListener("raycaster-intersected-cleared", this.data.EVENTS.onleave.bind(this));
  },

  // Moves this panel in the same x,y,z as the controller
  // Moves the panel around the controller in the shape of a sphere when turing.
  /**
   * @param ctrl - Controller element
   */
  controllerDrag: function(ctrl) {
    //console.log(ctrl);
    this.deltaPos.copy(this.ctrlInitPos);
    this.deltaPos.sub(ctrl.getAttribute('position'));

    //let panelPos = this.el.getAttribute('position');

    this.updatedPos.copy(this.panelInitPos);
    this.updatedPos.sub(this.deltaPos);

    this.el.setAttribute('position', `${this.updatedPos.x} ${this.updatedPos.y} ${this.updatedPos.z}`)
    //this.


    //console.log("Position: ", rightHand.getAttribute('position'));

    // Limit the Console log only every half a second
    if (this.tickIndex <= 40) {
      console.log('Position: ', this.deltaPos);
      this.tickIndex = 0;
    }

    this.tickIndex ++;
  },
  initControllerDrag: function(ctrl) { 
    let posCtrl = ctrl.getAttribute('position');
    let posPanel = this.el.getAttribute('position');
    if (posCtrl && posPanel) {
      this.ctrlInitPos.copy(posCtrl);
      this.panelInitPos.copy(posPanel);

      let angle = this.ctrlInitPos.angleTo(this.initIntersectionPos);

      console.log('ctrl Init Pos', this.ctrlInitPos);
      console.log('intersection init Pos', this.initIntersectionPos);

      console.log('ctrl Angle: ', angle);
      //console.log("init ", this.ctrlInitPos);
      this.dragEnable = true;
    }
  },
  endControllerDrag: function () {
    this.dragEnable = false;
  },
  /**
   * @return child object node - Returns object of a child element 
   * of this panel if any has the state "hover". Else returns undefined
   */
  isHoverOnChild: function () {
    let children = [...this.el.childNodes];
    let childHovering = undefined;

    children.forEach((child) => {
      let valid = child && child.is;
      if (valid) {
        if (child.is('hover')) {childHovering = child}
      }
    });

    return childHovering;
  },
  /**
   * Dims all text children elements color 
   */
  // TODO find way to reference ColorHelper class
  // dimText() {
  //   let textEls = [...this.el.children];
  //   textEls.forEach((el) => {
  //     if (el.nodeName == 'A-TEXT') {
  //       let dimColor = colorHelper.dim(`#${this.textColor.getHexString()}`, 3);
  //       el.setAttribute('color', dimColor);
  //     }
  //   });
  // },
  // /**
  //  * Un dims all text children elements color 
  //  */
  // unDimText() {
  //   let textEls = [...this.el.children];
  //   textEls.forEach((el) => {
  //     if (el.nodeName == 'A-TEXT') {
  //       el.setAttribute('color', `#${this.textColor.getHexString()}`);
  //     }
  //   });
  // },
  /**
   * Emits the event on a child
   * @param {ChildNode} child
   * @param {String} eventName - The event name ex: mousedown
   * @param {Event} e 
   */
  emitOnChild(child, eventName, e) {
    let event = new MouseEvent(eventName, e);
    child.dispatchEvent(event);
  },

  /**
   * If UIBreadCrumbs exist. Find it and set the width and height, and any initial breadcrumbs.
   * This will stop creating breadcrumbs when it find the currentPanelName
   * @param currentPanelName - The current panel name.
   * 
   */
  initUIBreadCrumbs(currentPanelName, options = {}) {
    console.log('compoenets before', this.el.components);
    let breadcrumbs = this.el.components['nav-breadcrumbs'];

    // If breadcrumbs have crumbs -> Add them


    if (breadcrumbs != undefined) {
      breadcrumbs.data.width = this.data.width;
      breadcrumbs.data.height = this.data.height / 2;
      // If existing bread crumbs. Add them up to the current one being added.
        let tempCrumbs = breadcrumbs.crumbs;
        let indexReached = -1;
        breadcrumbs.resetBreadcrumbs();

          for(let i=0; i<tempCrumbs.length; i++) {
            breadcrumbs.addBreadCrumb(tempCrumbs[i].label, tempCrumbs[i].panelName);
            if (tempCrumbs[i].panelName === currentPanelName) {return};
            indexReached = i;
            // Add new breadcrumb if current panel isn't already one
            
          };

          if (indexReached === tempCrumbs.length-1 || tempCrumbs.length === 0) {
            if (options.panelName) {breadcrumbs.addBreadCrumb(options.panelName, currentPanelName)}
            else {breadcrumbs.addBreadCrumb(currentPanelName, currentPanelName)}
          }
    } else {
      console.warn('breadcrumbs not defined on panel', this.el);
    }
  },

  /**
   * @param panel - Actual name of panel found in panel.js
   * @param options - Options for goToPanel and UIBreadCrumbs
   * {
   *   panelName: {String} Custom name of the panel. Kinda like a hyperlink.
   * 
   * }
   */
  goToPanel: function(panel, options) {

    this.getPanelHtml(panel, (html) => {
      if (html === "") {
        console.log('Panel Change Failed');
        return;
      }

      this.el.innerHTML = html;
      this.initUIBreadCrumbs(panel, options);
    });
    
  },

  /**
   * Returns the view map as a javascript object
   */
  getViewMap() {
    //console.log('NavURL', this.navMapUrl);
    return request.get(this.navMapUrl)
      .set('Accept', 'application/json');
  },

  getPanelHtml(panelName, callback) {
    if (!this.viewMap) {
      console.warn('View Map Undefined');
      callback('');
      return;
    }
    try {
      let viewDir = this.viewMap.panelViews[panelName];
      if (!viewDir) {
        console.warn('Access Failed to panel name: ', panelName, 'on element', this.el);
        callback('');
        return;
      }

      let url = this.viewMap.baseDir + viewDir;
      request.get(url)
      .end((err, res) => {
        if (res.status >= 400) {
          console.warn('Status', res.status, res);
          callback('');
          return;
        } else {
          callback(res.text);
          return;
        }
      });
      
    } catch(e) {
      console.log(e);
      callback('');
      return;
    }
  }
});
