/**************************************************/
/* Autor:  Diro Baloska s0566367                  */
/*                                                */
/* p5.js Template                                 */
/* Stand: 17.10.2020                              */
/*                                                */
/**************************************************/

/* Variablendeklaration */
var t = 0;                        // Zeit
var dt;                           // Zeitquant - wird auf die Bildwechselrate bezogen 
var frmRate;                      // Fliesskommadarstellung für Kehrwertbildung notwendig!
let gameWorld;
let ratioX;     //ratio von Pixel pro 2mm in X
let ratioY;     //ratio von Pixel pro 2mm in Y
let centerX;    //0 Punkt des Kartesisches Systems in X Achse
let centerY;    //0 Punk des Kartesisches Systems in Y Achse

//*********** die folgenden Variablen sind Pflicht! *********************/
var canvas;
var canvasID = 'pTest'; // ist eine Variable!!!

function setup()
	{
		canvas = createCanvas(windowWidth, windowHeight);
		canvas.parent(canvasID);
        
        ratioX = windowWidth / 2000;
        ratioY = windowHeight / 2000;

        centerX = windowWidth/2;
        centerY = windowHeight - (0.2 * windowHeight);

		frmRate = 60;
		frameRate(frmRate);
        dt = 1.0/frmRate;
        
        gameWorld = new GameWorld();
	}
	
function draw()
	{
		background('#aaaaff');
		
		//******* Darstellung **** Hier wird in Pixeln gerechnet! **********************
		fill('#ff0000');
		
		//******* Berechnung der Bewegung und der Maßstäbe **** Hier wird in Metern gerechnet! **************************		

			
        //****************************************** Administration ********************************************
        push();
		fill(0);
        textSize(40 * ratioX);
        text("Diro Baloska S0566367 17.10.2020", 400, 50);
        pop();
        
        gameWorld.createWorld();
	}

    
/**
 * Table of contents
 * 
 * NOTIZ an Herrn Naumburger:
 * 
 * Das Class-System von p5.js referenziert das Class System von MDN webseite, https://p5js.org/reference/#/p5/class.
 * Ich gehe davon aus, dass p5 keine Klasse erzeugen kann, sondern man definiert selbst, was für eine Klasse man mit den P5-Objekten
 * zum Beispiel Rect, Circle, Triangle definieren will, so wie ich unten die Klasse geschrieben habe. Das heißt, beide die Klasse und die Objecte
 * von Javascript sind.
 * Die Klasse unten habe ich so geschriben, dass beim Bewegen von Objecten das Form nicht kaputt geht.
 * 
 * Maßtab in mm, wo die Anmessungen nochmal durch 2 geteilt werden,
 * damit alles im Monitor gezeigt würde(Als ob das Monitor 2x die Größe geworden).
 * 
 * Mitten von Wippe ist -600mm und 600mm in Kartechichen Koordinaten, das entspricht 0.6m nach links und rechts und in Total 1,2m breit.
 * Der Ball hat Diameter von 32mm, weil Radius soll 16mm sein.
 * Die Wippe sind 250mm breit und 20mm dick, und um 20 grad auf der Mitte gedreht.
 * 
 * Die große Dreiecke liegt genau an der Mitte den Wippen.
 */

/**
 *
 * 1. BALL CLASS
 *     1.1. Constructor
 *     1.2. changePosition()
 *     1.3. drawBall()
 * 
 * 2. RECT CLASS
 *     2.1 Constructor
 *     2.2. modify()
 *     2.3. create()
 * 
 * 3. TRIANGLE CLASS
 *     3.1. Constructor
 *     3.2. modify()
 *     3.3. create()
 * 
 * 4. GAMEWORLD CLASS
 *     4.1. Constructor
 *     4.2. createWorld()
 */

//===================1. BALL CLASS==================/
class Circle {

    //1.1.
    /**
     * constructor for object ball
     * takes parameter: 
     * @param {int} diameter - the radius of the sphere
     * @param {color(int,int,int)} - color of circle
     * @param {int} posX - the starting position in x in millimeter
     * @param {int} poxY - the starting position in y in millimeter
     * @param {int} xMovement - the range of movement each time draw being called in x
     * @param {int} yMovement - the range of movement each time draw being called in y
     */
    constructor(diameter, color, withStroke, posX, poxY, xMovement, yMovement) {
        this.diameter = diameter * ratioY;
        this.color = color;
        this.withStroke = withStroke;
        this.position = createVector(centerX + posX * ratioX, centerY - poxY * ratioY);
        this.movementVelocity = createVector(xMovement * ratioX, yMovement * ratioY);
    }

    //1.2.
    /**
     * Update the position of the ball according to the movement given to the constructor
     */
    changePosition () {
        let radius = this.diameter / 2;
        if(this.position.x - radius > 0 && this.position.x + radius < screen.width&&
            this.position.y - radius > 0 && this.position.y + radius < screen.height) {
            this.position.x += this.movementVelocity.x;
            this.position.y -= this.movementVelocity.y;
        } else {
            this.color = color(random(0,255),random(0,255),random(0,255));
            this.movementVelocity.x = -1 * this.movementVelocity.x;
            this.position.x += this.movementVelocity.x;
            this.movementVelocity.y = -1 * this.movementVelocity.y;
            this.position.y -= this.movementVelocity.y;
        }
    }

    //1.3.
    /**
     * Create a circle with the radius given to constructor 
     */ 
    create () {
        if(!this.withStroke) noStroke();
        fill(this.color);
        circle(this.position.x, this.position.y, this.diameter);
    }
}


//======================2. Rect Class=====================/
class Rect {

    /**
     * @param {color(int, int, int)} color - The color fill for the object
     * @param {int} x0 - center position in x in millimeter
     * @param {int} y0  - center position in y in millimeter
     * @param {int} width - width of rect in millimeter
     * @param {int} height - height of rect in millimeter
     */
    constructor(color, x0, y0, width, height ) {
        this.color = color;
        this.x0 = centerX + x0 * ratioX;
        this.y0 = centerY - y0 * ratioY;
        this.width = width * ratioX;
        this.height = height * ratioY;
    }

    /**
     * modify rect's rotation and position
     * @param {*} angle - angle of rotation default 0
     * @param {*} deltaX - range of movement in X, default 0
     * @param {*} deltaY - range of movement in Y, defaul t0
     */
    modify(angle = 0, deltaX = 0, deltaY = 0) {
        rectMode(CENTER);
        translate(this.x0 + deltaX * ratioX,this.y0 + deltaY * ratioY);
        angleMode(DEGREES);
        rotate(angle);
    }

    create() {
        noStroke();
        fill(this.color);        
        rect(0, 0,this.width,this.height);
    }
}

//====================3. Triangle Class=================//
class Triangle {
    constructor(x0,y0, x1,y1,x2,y2) {
        this.x0 = centerX + x0 * ratioX;
        this.y0 = centerY - y0 * ratioY;
        this.x1 = centerX + x1 * ratioX;
        this.y1 = centerY - y1 * ratioY;
        this.x2 = centerX + x2 * ratioX;
        this.y2 = centerY - y2 * ratioY;
    }

    /**
     * modify triangle's rotation and position
     * @param {*} angle - angle of rotation default 0
     * @param {*} deltaX - range of movement in X, default 0
     * @param {*} deltaY - range of movement in Y, defaul t0
     */
    modify(angle = 0, deltaX = 0, deltaY = 0) {
        translate(this.x0 + deltaX, this.y0 - deltaY);
        angleMode(DEGREES);
        rotate(angle);
    }

    create() {
        noStroke();
        fill(color(100,180,255));
        triangle(0,0,this.x1-this.x0, this.y1-this.y0, this.x2-this.x0, this.y2-this.y0);
    }
}


//====================4. GameWorld class================//
class GameWorld {

    /**
     * Things inside the game world
    */
    constructor() {
        //Mittelpunkt(-600,125)(600mm oder 0,6m nach links),breite=250nn(25cm)
        this.wippeLinks = new Rect(color(100,180,255), -600, 125, 250, 20);
        //Mittelpunkt(600,125)(600mm oder 0,6m nach rechts),breite=250mm(25cm)
        this.wippeRechts = new Rect(color(100,180,255), 600, 125, 250, 20);

        this.leftScoreBox = new Rect(color(255,0,0), -400, 15, 50, 20);
        this.rightScoreBox = new Rect(color(255,0,0), 400, 15, 50, 20);
        
        //breite=ganze Bildschirm, dick=50,MittelPunkt(0,0) 
        this.boden = new Rect(color(0,0,0), 0, 0, windowWidth / ratioX, 50);

        //diameter=32mm, r=16mm, mittelpunkt(0,16+25)
        this.middleBall = new Circle(32, color(255,0,0), true, 0, 41, 0, 0);

        //diameter=32mm, r=16mm
        this.leftBall = new Circle(32, color(0,255,0), true, -700, 225, 0, 0);        
        //diameter=32mm, r=16mm
        this.rightBall = new Circle(32, color(0,0,255), true, 700, 225, 0, 0);

        //Mittelpunkt(-600,125)
        this.leftBottomTriangle = new Triangle(-600, 125, -635, 25, -565, 25);
        //Mittelpunkt(600,125)
        this.rightBottomTriangle = new Triangle(600, 125, 635, 25, 565, 25);
        
        this.leftTopTriangle = new Triangle(-680, 245, -690, 190, -670, 190);
        this.rightTopTriangle = new Triangle(680, 245, 690, 190, 670, 190);
    }

    /**
     * create game world
     */
    createWorld () {        
        //================BALL====================//
        push();
        this.middleBall.create();
        pop();

        push();
        this.leftBall.create();
        pop();

        push();
        this.rightBall.create();
        pop();


        //===============SLEDGE===============//
        push();
        this.wippeLinks.modify(20);
        this.wippeLinks.create(-20);
        pop();
    
        push();
        this.wippeRechts.modify(-20);
        this.wippeRechts.create();
        pop();
    

        //=================FLOOR===============//
        push();
        this.boden.modify();
        this.boden.create();
        pop();

        //=============SCORE BOXES===============//
        push();
        this.leftScoreBox.modify();
        this.leftScoreBox.create();
        pop();

        push();
        this.rightScoreBox.modify();
        this.rightScoreBox.create();
        pop();

        //============BIG SUPPORT TRIANGLE===========//
        push();
        this.leftBottomTriangle.modify();
        this.leftBottomTriangle.create();
        pop();

        push();
        this.rightBottomTriangle.modify();
        this.rightBottomTriangle.create();
        pop();

        //=============BALL SUPPORT SMALL TRIANGLE=============//
        push();
        this.leftTopTriangle.modify(20);
        this.leftTopTriangle.create();
        pop();

        push();
        this.rightTopTriangle.modify(-20);
        this.rightTopTriangle.create();
        pop();
    
    }
}