/*

   HTML5 Canvas Gauge Gadget                                                            @ 21.07.2010, Mittwoch
   
   Aydin "/dev/mach" Ulf.   
   info@devmach.com
   
   You can use and distrubute this gadget freely but don't be a dickhead say thanks and don't delete my name !
*/


      function devmachGauge(){
         this.startAngle = 190;
         this.stopAngle  = 350;
         this.diffAngle  = (this.stopAngle - this.startAngle) / 100;         
         this.canvas_list = [];
         this.color_list  = [];

         this.canvasSupported = true;
         
      } 

      devmachGauge.prototype = { 
         //================================================================================================
         deg2rad: function (deg){return deg * ( Math.PI / 180 )},
         //================================================================================================         
         hex2rgba: function ( hex ){
            if( this.color_list[hex] != null ) 
               return this.color_list[hex];
            
            hex1 = /([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/.exec(hex);
            var r = parseInt('0x'+hex1[1]);
            var g = parseInt('0x'+hex1[2]);
            var b = parseInt('0x'+hex1[3]);
            this.color_list[hex] = ['rgba(',r,',',g,',',b,',1)'].join('');
            
            return this.color_list[hex];
         },
         //================================================================================================                  
         percCalc: function(min,max,val){
            var mid = (min+max)/2 ;
            var step= (max-mid)/50;
            
            val-= mid;
            val/=step;
            val+=50;
            // yes ! we lost some precision.... If you care change it to .toFixed(2) or something like that
            return val.toFixed();
         },
         //================================================================================================         
         draw   : function (canvasID, newValue, gaugeColor, arrowColor, backgroundColor) {       
   
            if ( !this.canvasSupported ) return;
            if ( newValue < 0  ) newValue = 0;
            if ( newValue > 100) newValue = 100;
            
            if( this.canvas_list[canvasID] != null ) {
               canvas = this.canvas_list[canvasID];            
            } else {
               var canvas = document.getElementById(canvasID);
               this.canvas_list[canvasID] = canvas;
            }
            
            if( canvas == null ) { alert("Canvas element doesn't exists !"); return; }                         
            if( !canvas.getContext ) { alert("Your browser don't support canvas element !"); this.canvasSupported = false; return; }
            
            newValue = this.startAngle + (newValue * this.diffAngle);            
            var canvasW= canvas.width ;
            var canvasH= canvas.height;     
            var context = canvas.getContext('2d');

            context.fillStyle   =  this.hex2rgba( (backgroundColor||'#FFFFFF') );
            context.fillRect(0,0,canvasW,canvasH); // clear canvas                         
            context.moveTo(canvasW,canvasH);
            //===================================================================
            context.fillStyle   = this.hex2rgba( ( gaugeColor || '#9ECAE1' )); 
            context.beginPath();
            context.arc( canvasW/2, canvasH, canvasW / 2, this.deg2rad(this.startAngle) , this.deg2rad(this.stopAngle), false);
            context.lineTo(canvasW/2,canvasH);
            context.closePath();      
            context.fill();
            //===================================================================
            context.beginPath();
            context.fillStyle   = this.hex2rgba( (backgroundColor||'#FFFFFF') );
            context.arc( canvasW/2, canvasH, (canvasW / 2) * 0.625, this.deg2rad(this.startAngle-10), this.deg2rad(this.stopAngle+10), false);
            context.lineTo(canvasW/2,canvasH);
            context.closePath();      
            context.fill();      
            //===================================================================
            context.beginPath();                  
            context.fillStyle = this.hex2rgba( ( arrowColor || '#000000' ) );
            context.lineTo(canvasW/2 + (10       * Math.cos( this.deg2rad(newValue-20) )), canvasH + (10       *Math.sin( this.deg2rad(newValue-20)) ) );      
            context.lineTo(canvasW/2 + (canvasW/2* Math.cos( this.deg2rad(newValue   ) )), canvasH + (canvasW/2*Math.sin( this.deg2rad(newValue   )) ) );
            context.lineTo(canvasW/2 + (10       * Math.cos( this.deg2rad(newValue+20) )), canvasH + (10       *Math.sin( this.deg2rad(newValue+20)) ) );
            context.lineTo(canvasW/2,canvasH);         
            context.closePath();            
            context.fill();            
         }
         //================================================================================================      
      };    
