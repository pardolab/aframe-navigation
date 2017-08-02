module.exports = AFRAME.registerComponent('nav-layout', {
  multiple: true,
  schema: {
    opacity: {type: "number", default: 0.8},
    hoverOpacity: {type: "number", default: 0.3},
    color: {type: "color", default: "#010101"},
    edgeColor: {type: "color", default: "#010101"},
    textColor: {type: "color", default: "#fefefe"},
    label: {type: "string", default: "Menu"},
    distanceAway: {type: "number", default: 5},      // Distance away from user in meters
    layoutView: {type: "string", default: ''},
    navMapUrl: {type: 'string', default: ''},
    cameraEl: {type: 'selector', default: ''},
    name: {type: "string", default: "default"}
  },
  init: function () {

    this.currentlayoutView = this.data.layoutView;
    this.viewMap = undefined;
    this.staticHtml = "";
    let viewMapRequest = this.getViewMap();
    this.id = this.el.getAttribute('id');
    

    viewMapRequest.end((err, res) => {
      if (err) {console.error('No view map found', err); return}
      
      this.viewMap = res.body;
      this.getNavHtml('static-nav', (html) => {
        this.staticHtml = html;
        this.goToView(this.currentlayoutView);
      })     
    });

    // Allows for immediate opening of nav
    // setTimeout(() => {
    //   console.log(this.viewMap);
    // }, 1000);
    

    this.cameraQuat = new THREE.Quaternion();
    this.cameraAngles = new THREE.Euler();

    // SET Camera direction vector
    this.cameraDir = new THREE.Vector3();     // Camera direction
    this.cameraPos = new THREE.Vector3();     // Camera direction
    this.newMenuPos = new THREE.Vector3();    // New menu position
    this.newMenuRot = new THREE.Vector3();    // New menu rotation

    
// Position
    this.setPosition();

// Style event listeners

    const EVENTS = {
      onenter: (e) => {          // When raycaster is on button
        console.log("Layout onEnter");
      },
      onactivate: (e) => {       // When raycaster is clicked on the button
        console.log("Layout onActivate");
      },
      onrelease: (e) => {        // When raycaster releases the click
        console.log("Layout onRelease");
      },
      onleave: (e) => {          // When raycaster leaves button
        console.log("Layout onLeave");
      },
    }

    this.el.emit('onready', {
      id: this.id,
      name: this.data.name,
      data: this.data,
      target: this.el
    });

  },
  update: function (oldData) {
    //console.log('Setting new data', this.data);
    //uiPanelGroupData.setData(this.data);
    // On change reset view
    if (oldData.layoutView !== this.data.layoutView) {
      this.currentlayoutView = this.data.layoutView;
      this.goToView(this.currentlayoutView);
    }
  },
  tick: function () {},
  remove: function () {
    this.el.removeObject3D('plane');
    this.el.removeObject3D('highlighter', this.meshHighlighter);
  },
  pause: function () {},
  play: function () {},

  // Sets the nav position 
  setPosition: function() {
    if (this.data.cameraEl == undefined) {
      // Set position at {x:0, y:0, z:0}
      this.el.setAttribute('position', `0 0.8 -2`);
      this.el.setAttribute('rotation', `0 0 0`);
      return '';
    } else {
      let cameraPos = this.data.cameraEl.getAttribute('position');
      let camera = this.data.cameraEl.getObject3D('camera');

      let theta = Math.atan2(this.cameraDir.x, this.cameraDir.z);  // Get Theta for XZ Plane

      this.newMenuPos.x = (this.data.distanceAway * Math.sin(theta)) + cameraPos.x - 4;
      this.newMenuPos.z = (this.data.distanceAway * Math.cos(theta)) + cameraPos.z + 3.8;
      this.newMenuPos.y = cameraPos.y + 0.3;

      let degrees = (theta * 180/Math.PI) + 180;
      this.newMenuRot.y = degrees; // y rotation

      this.el.setAttribute('position', `${this.newMenuPos.x} ${this.newMenuPos.y} ${this.newMenuPos.z}`);
      this.el.setAttribute('rotation', `0 ${this.newMenuRot.y} 0`);
    }
    
  },

  // Saves the positions of all panels
  saveNavLayout: function() {

  },

  // A nav setup
  goToView: function(view) {

    this.getNavHtml(view, (html) => {
      if (html === "") {
        console.log('View Change Failed');
        this.el.innerHTML = this.staticHtml;
        return;
      }

      this.el.innerHTML = (this.staticHtml + html);
      this.currentlayoutView = view;
    });
    
  },

  /**
   * Returns the view map as a javascript object
   */
  getViewMap() {
    return request.get(this.data.navMapUrl)
      .set('Accept', 'application/json');
  },

  getNavHtml(viewName, callback) {
    if (!this.viewMap) {
      console.warn('View Map Undefined');
      callback('');
    }
    try {
      let viewDir = this.viewMap.layoutViews[viewName];
      if (!viewDir) {
        console.warn('View Directory Undefined');
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
