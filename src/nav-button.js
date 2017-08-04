




module.exports = AFRAME.registerComponent('nav-button', {

  multiple: true, 
  schema: {
    radius: {type: "number", default: 0.0},
    width: {type: "number", default: 0.0},
    height:{type: "number", default: 0.0},
    shape: {type: "string", default: 'square'},         // Can be square or circle
    opacity: {type: "number", default: 0.8},
    color: {type: "color", default: "#25daf9"},
    hoverColor: {type: "color", default: "#8affff"},
    borderColor: {type: "color", default: "#fefefe"},   // Color of border
    textColor: {type: "color", default: "#010101"},
    textAlign: {type: 'string', default: 'center'},     // left, right, center
    textOnHover: {type: 'boolean', default: 'false'},
    textOffset: {type: 'number', default: '0'},
    label: {type: "string", default: ""},
    image: {type: "string", default: ""},
    textWidth: {type: "number", default: 4},
    textHeight: {type: "number", default: 4},
    textLineHeight: {type: "number", default: 0},
    name: {type: "string", default: "default"},
    mixinObj: {type: 'string', default: "none"},
    toolName: {type: 'string', default: ''},
    link: {type: "string", default: ""},
    linkName: {type: "string", default: ""},
    rayClass: {type: "string", default: "interactive"}
    // mesh: undefined
  },
  init: function () {

    //As of AirBnB suggestion: https://github.com/airbnb/javascript#objects--prototype-builtins
      //This caches the general Object, so that's why it's a constant and not 'this';
      const has = Object.prototype.hasOwnProperty;
      this.id = this.el.getAttribute('id');

// Definitions
    this.BUTTON_SEGMENTS = 30;
    this.dragOffButton = false;
    this.BORDER_OFFSET = this.data.radius + 0.02;
    this.BORDER_OPACITY = 1;
    this.DEPTH = 0.001;
    this.currentPos = this.el.getAttribute('position');
    this.hDistance = (this.data.width) ? this.data.width : this.data.radius;   // Horizontal Distance
    this.vDistance = (this.data.height) ? this.data.height : this.data.radius;   // Vertical Distance

    this.color = new THREE.Color(this.data.color);
    this.hoverColor = new THREE.Color(this.data.hoverColor);
    this.borderColor = new THREE.Color(this.data.borderColor);
    this.textColor = new THREE.Color(this.data.textColor);

    // All of the controllerElements - Map
    this.controllerElements = new Map();
    this.controllerElements.set('ctrl', document.querySelector('[laser-controls]'));

    // Set To be Interactive; Able to be detected by the raycaster/controller
    this.el.setAttribute('class', this.data.rayClass);
    
    // TODO: Only uses objectPlacement when tool is available
    // if (this.data.toolName.length > 0) 
    //   this.listenForObjectPlacement();

    // Set Position
    if (this.currentPos) {
      let x = (this.currentPos.x) ? this.currentPos.x : 0,
          y = (this.currentPos.y) ? this.currentPos.y : 0,
          z = (this.currentPos.z) ? this.currentPos.z : 0;
      this.el.setAttribute('position', `${x} ${y} ${z + this.DEPTH}`);
    } else {
      this.el.setAttribute('position', `0 0 ${this.DEPTH}`);
    }
    

    this.EVENTS = {
      onenter: (e) => {          // When raycaster is on button

          if (!this.el.is('hover')) {
            this.el.addState('hover');
            // Border
            this.el.setObject3D('border', this.borderMesh);

            this.el.emit('onenter', {
              id: this.id,
              name: this.data.name,
              data: this.data,
              target: this.el,
              event: e
            });
            console.log('button hovering');

            if (this.data.textOnHover) {
              this.el.appendChild(this.textEl);
            }
          }
      },
      onactivate: (e) => {

          if (this.el.is('hover') && !this.el.is('active')) {
            this.el.addState('active');

            // Todo: Color Change
            console.log('Hover Color', this.hoverColor.getHex())
            this.mesh.material.color.set(this.hoverColor);

            // Button Events
            this.el.emit('onactivate', {
              id: this.id,
              name: this.data.name,
              data: this.data,
              target: this.el,
              event: e
            });
            console.log('button active');
          }
      },
      onrelease: (e) => {        // When raycaster releases the click

        if (!this.el.is('hover') && this.el.is('active')) return;

        // Todo: Color Change
        this.mesh.material.color.set(this.color);

        if (this.el.is('active')) {
          this.mapToControllers();
        }
        this.el.removeState('active');

        this.el.emit('onrelease', {
          id: this.id,
          name: this.data.name,
          data: this.data,
          target: this.el,
          event: e
        });
        console.log('button release');
        
      },
        // When raycaster leaves button
      onleave: (e) => {

        // in case the use leaves the button without releasing
        if (!this.el.is('hover')) return;

        try {
          this.el.removeObject3D('border');
        } catch (e) {}

        // Text only appears when hovering, if the value is true
        if (this.data.textOnHover) {
            this.el.removeChild(this.textEl);
        }

        if (this.el.is('active')) {
          // Todo: Color Change
          this.mesh.material.color.set(this.color);
          // Cursor Off
          this.el.removeState('active')
        };

        this.el.removeState('hover');
        this.el.emit('onleave', {
          id: this.id,
          name: this.data.name,
          data: this.data,
          target: this.el,
          event: e
        });
        console.log('button leave');
      }
    }

      // Create Shape
      switch (this.data.shape) {
        case "circle":
          this.createCircle();
          break;
        case "square":
          this.createRect();
          break;
      }


    // Button Text Component
    this.textEl = document.createElement('a-text');
    
    let textValue = "";
    if (this.data.label !== "") {

    } else {

    }
    this.textEl.setAttribute("value", this.data.label);
    this.textEl.setAttribute("color", this.textColor.getHex());
    this.textEl.setAttribute("width", this.data.textWidth);
    this.textEl.setAttribute("height", this.data.textHeight);
    
    if (this.data.lineHeight !== 0) {
      this.textEl.setAttribute("lineHeight", this.data.lineHeight);
    }

      this.textEl.setAttribute("align", "center");

    const TEXT_LENGTH_DIVISOR = 20;
    const TEXT_X_OFFSET = 0.1 + this.data.textOffset;
    const TEXT_Y_MULTIPLYER = 1.8;

    // Aligning Text
    switch(this.data.textAlign) {
      case 'center':
        this.textEl.setAttribute("position", "0 0 0.001");
      break;
      case 'left':
        this.textEl.setAttribute("position", `${-this.hDistance/2 - TEXT_X_OFFSET - (this.data.label.length/TEXT_LENGTH_DIVISOR)} 0 0.001`);
      break;
      case 'right':
        this.textEl.setAttribute("position", `${this.hDistance/2 + TEXT_X_OFFSET + (this.data.label.length/TEXT_LENGTH_DIVISOR)} 0 0.001`);
      break;
      case 'above':
        this.textEl.setAttribute("position", `0 ${this.vDistance * TEXT_Y_MULTIPLYER} 0.001`);
      break;
      case 'below':
        this.textEl.setAttribute("position", `0 ${-this.vDistance * TEXT_Y_MULTIPLYER} 0.001`);
      break;
      default:
        console.log(`Text alignment of button ${this.el} is broken`);
    }

    // Appening Text
    if (!this.data.textOnHover) {
      this.el.appendChild(this.textEl);
    }

    this.el.emit('onready', {
      id: this.id,
      name: this.data.name,
      data: this.data,
      target: this.el
    });

  },
  update: function (oldData) {

      // Setup Controller Callbacks
      this.addAllEventListeners();

    // Button Events
    if ( oldData.label !== this.data.label ) {
      this.textEl.setAttribute('value', this.data.label);
    }

    if (oldData.opacity !== this.data.opacity) {
      this.mesh.material.opacity = this.data.opacity;
      this.borderMesh.material.opacity = this.data.opacity;
    }

  },
  tick: function () {},
  remove: function () {
    this.el.removeObject3D('plane');
    this.el.removeObject3D('border');

    this.removeAllEventListeners();
  },
  pause: function () {
    this.removeAllEventListeners();
  },
  play: function () {
    this.addAllEventListeners();
  },

/**
* Gets all 3D Objects on the element
* @param element - the aframe element
* @returns Array of objects
**/
  getAll3DObjects: function (element) {
    let a = [];
    let plane = undefined;
    let border = undefined;

    plane = element.getObject3D('plane');
    border = element.getObject3D('border');

    if (plane) {a.push(plane)}
    if (plane) {a.push(border)}

    return a;
  },

  addAllEventListeners: function () {
    // Setup Controller Callbacks

    this.el.addEventListener('mouseup', this.EVENTS.onrelease.bind(this));
    this.el.addEventListener('mousedown', this.EVENTS.onactivate.bind(this));
    this.el.addEventListener("raycaster-intersected", this.EVENTS.onenter.bind(this));
    this.el.addEventListener("raycaster-intersected-cleared", this.EVENTS.onleave.bind(this));

  },

  removeAllEventListeners: function () {
    // Setup Controller Callbacks

    this.el.removeEventListener('mouseup', this.EVENTS.onrelease.bind(this));
    this.el.removeEventListener('mousedown', this.EVENTS.onactivate.bind(this));
    this.el.removeEventListener("raycaster-intersected", this.EVENTS.onenter.bind(this));
    this.el.removeEventListener("raycaster-intersected-cleared", this.EVENTS.onleave.bind(this));
  },

  /**
   * Creates a circle geometry with the corisponding materials.
   */
  createCircle() {
     // Create geometry.
    this.geometry = new THREE.CircleBufferGeometry(this.hDistance, this.BUTTON_SEGMENTS);
    // Create material.

    let imageLoader = new THREE.TextureLoader();
    imageLoader.setCrossOrigin('anonomous');

    const planeMaterialConfig = {
      color: this.color.getHex(),
      side: 'double',
    }

      // Add image if available
      try {
        if (!this.data.image) {
          let map = imageLoader.load(this.data.image);
          planeMaterialConfig.map = map;
        }
      } catch(e) {
        console.warn('Image Load Failed', e)
      }
      

    this.material = new THREE.MeshBasicMaterial(planeMaterialConfig);
    this.material.transparent = true;
    this.material.opacity = this.data.opacity;

      //this.planeMaterials.push(this.planeMaterials);


      // Create mesh.
      this.mesh = new AFRAME.THREE.Mesh(this.geometry, this.material);
      this.el.setObject3D('plane', this.mesh);



// Border
    this.borderGeo = new THREE.RingBufferGeometry(this.hDistance, this.BORDER_OFFSET, this.BUTTON_SEGMENTS);
    // Create material.
    this.borderMaterial = new THREE.MeshBasicMaterial({
        color: this.borderColor.getHex(),
        side: 'double'
      }
    );
    this.borderMaterial.transparent = true;
    this.borderMaterial.opacity = this.BORDER_OPACITY;
    this.borderMesh = new THREE.Mesh(this.borderGeo, this.borderMaterial);
  },
  /**
   * Creates rectangle button. Includes geometry, mesh, background overlays.
   */
  createRect() {
    const DEPTH = 0.002;
    const BORDER_SIZE = 0.0001;
    const TRANSLATE_OFFSET = BORDER_SIZE/2;
    this.geometry = new THREE.BoxBufferGeometry(this.data.width, this.data.height, DEPTH, this.BUTTON_SEGMENTS);

    // Border
    this.borderGeo = new THREE.EdgesGeometry( this.geometry );


    // Background Material
    this.material = new THREE.MeshBasicMaterial({
        color: this.color.getHex(),
        side: 'double'
      });

    this.material.transparent = true;
    this.material.opacity = this.data.opacity;

    // Border Material
    this.borderMaterial = new THREE.MeshBasicMaterial({color: this.borderColor.getHex()});

    this.borderMaterial.transparent = true;
    this.borderMaterial.opacity = this.BORDER_OPACITY;

    // Create mesh.
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.borderMesh = new THREE.LineSegments( this.borderGeo, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

    this.el.setObject3D('plane', this.mesh);
  },
  
  mapToControllers() {
    if (this.data.toolName.length === 0) return;

    this.controllerElements.forEach((ctrl) => {
      //Added as a safeguard. 
      if (ctrl === null) return;
      console.log("Controllers mapped");
      ctrl.setAttribute('object-placement', {
        toolName: this.data.toolName
      });
    });
    },

    removeObjectPlacement(ctrl) {
      ctrl.removeAttribute('object-placement');
    },

    listenForObjectPlacement : function() {
      this.controllerElements.forEach((ctrl) => {
        //Added as a safeguard. 
        if (ctrl === null) return;
        const __this = this;
        ctrl.addEventListener('objectPlaced', function(e) {
          __this.removeObjectPlacement(ctrl)
        });
      });
    }
});
