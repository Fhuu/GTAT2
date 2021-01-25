/**************************************************/
/* Autor:  Dr. Volkmar Naumburger                 */
/*                                                */
/* Dezentraler Stoß                               */
/*                                                */
/* Obj. 1+2: Positionierung und Startgeschw. per  */
/*           Maus eingeben                        */
/* Stand: 29.12.2020                              */
/*                                                */
/* v0.0: Umstellung auf p5.js                     */
/**************************************************/

/* Variablendeklaration */
var M;                 // dyn. Maßstab 
var N;                 // Normierung der Geschw.vektoren zwecks Darstellung
var MassRatio;         // Schieberegler für Massenverhältnis

var fieldWidth = 6;    // Feldbreite in m

var x01 = 1, y01 = 0.6, x02 = 0, y02 = 0;                      // Startorte in m
var vx01 = -0.5, vy01 = -0.35, vx02 = 0, vy02 = 0;        // Startgeschwindigkeiten in m/s
var ball1 = {d: 0.4, x: x01, y: y01, vx: vx01, vy: vy01};     // 1. Stoßpartner
var ball2 = {d: 0.4, x: x02, y: y02, vx: vx02, vy: vy02};     // 2. Stoßpartner
var m1 = 1, m2;         // Masse Objekt B1 und B2

var v2x, v2y;               // Komponenten der Objektgeschwindigkeiten
var v1Z, v1Z_, v2Z, v2Z_;   // Zentralgeschw. vor und nach dem Stoß
var v1T, v1T_, v2T, v2T_;   // Tangentialgeschw.
var v1_, v2_;               // Geschwindigkeiten nach Stoß
var v2x_, v1x_;
var v2y_, v1y_;

var beta = 0;               // Stoß-Winkel bzw. der Bewegungen zu einander
var alpha1, alpha2;         // Einzelwinkel bezgl. x-Achse
var phi, gamma1, gamma2;    // Ergänzungswinkel
var STOSS, WEITER, DISPLAY = true;
var TOUCH_1, TOUCH_2;

var object_1, object_2;   // sensibler Hintergrund der Stoßpartner
var weiter, ENABLE = false;  // WEITER-Button, einmaliger Impuls, enable/disable
var statusCounter;      // Zustandszähler
var speedArrow_1, speedArrow_2;
var Wkin, Wkin_;
			
var dt;                // Increment der Zeitv.
var frmRate = 60;      // Screen-Refreshrate  */
var result;            // Parameterübergabe der circle-Objekte

//*********** die folgenden Variablen sind Pflicht! *********************/
var canvas;
var canvasID = 'pStoss_0014';
var inFocus = false;   // onblur-Ersatz von processing

function setup()
	{
		mediaType = getMediaType();
		canvas = createCanvas(width, height);
		canvas.parent(canvasID);
		touchEvents = document.getElementById (canvasID);
		
		evaluateConstants(70, 80);                   // Deklarierung wichtiger Parameter und Konstanten
		backgroundColor = '#a8a8ff';                 // Hintergrundfarbe
		textColor = manageColor(backgroundColor)[1]; // Textfarbe für numerische Angaben

		xi0 = 0.5*width;      // Nullpunkt für kart. Koordinatensystem rel. zum internen K.
		yi0 = 0.5*height;
		M = width/(fieldWidth);    // dyn. Maßstab
		N = 1;                     // Geschwindigkeitsnormierung
		frameRate(frmRate);
		dt = 1.0/frmRate;
		
		object_1 = new Circle(0.5*ball1.d, M, false, '#aaffaa', 'b');  // radius, scale, visible, color, mode
		object_2 = new Circle(0.5*ball2.d, M, false, '#ffaaff', 'b');
		speedArrow_1 = new Arrow(M, N, '#aaffaa');                      // M, N, color
		speedArrow_2 = new Arrow(M, N, '#ffaaff');
		weiter = new PushButton(80, 80, "WEITER", '#00ff00', true);  // xPos, yPos, name, trigger: ja
		MassRatio = new Scrollbar(60, 75, 0.5, 1, 2, '#00ff00', "m2/m1"); 
	}
	
function draw()
	{
		background(backgroundColor);
		prepareScreen("dezentraler Stoss mit Zwangsbedingung", "(ebene Unterlage, keine Gravitation)", 0, 50, 10);
		//displayLine("case: "+statusCounter, 255, 'CENTER', 10, 95);
		
		startProgram();
		if (weiter.drawButton(ENABLE))
			{
				dt = 1.0/frmRate;
				statusCounter++;
				DISPLAY = true;
				ENABLE = false;
			}
	
		if (START)
			{ /******************************* Initialisierung ***************************************/
				if (INIT)
					{
						INIT = false;
						dt = 1.0/frmRate;
						ball1.x = x01;        // Startorte wiederherstellen
						ball1.y = y01;
						ball2.x = x02;
						ball2.y = y02;
						ball1.vx = vx01;      // Startgeschwindigkeiten wiederherstellen
						ball1.vy = vy01;
						ball2.vx = vx02;
						ball2.vy = vy02;
						statusCounter = 0;
						STOSS = false;
						TOUCH_1 = false;      // Berührung mit der Ebene
						TOUCH_2 = false;
						DISPLAY = true;
						ENABLE = false;
					}

				m2 = m1*MassRatio.yValue()[1]; // Eingabe m2
				ball2.d = ball1.d*pow(m1/m2, -0.33);
				result = object_1.inCircle(ball1.x, ball1.y); // Ort Object 1
				ball1.x = result[1];
				ball1.y = result[2];
				if (result[0])
					{ //Startwerte merken
						x01 = result[1];
						y01 = result[2];
					}
				//displayLine("B1 status: "+str(result[2])+" Start: "+str(result[3])+" Move: "+str(result[4])+" End: "+str(result[5])+" enable: "+str(result[6]), 255, 'LEFT', 2, 80);
				result = speedArrow_1.moveArrow(ball1.x, ball1.y, ball1.vx, ball1.vy); // Geschw. Ort 1
				ball1.vx = result[1];
				ball1.vy = result[2];
				if (result[0])
					{ //Startwerte merken
						vx01 = result[1];     // Geschwindigkeitskompunenten kartesisch
						vy01 = result[2];
					}
				v1 = result[3];           // Geschwindigkeitsvektor polar
				alpha1 = result[4]; 

				result = object_2.inCircle(ball2.x, ball2.y);  // Ort Object 2
				ball2.x = result[1];
				ball2.y = result[2];
				if (result[0])
					{ //Startwerte merken
						x02 = result[1];
						y02 = result[2];
					}				
				//displayLine("B2 status: "+str(result[2])+" Start: "+str(result[3])+" Move: "+str(result[4])+" End: "+str(result[5])+" enable: "+str(result[6]), 255, 'LEFT', 2, 85);
				result = speedArrow_2.moveArrow(ball2.x, ball2.y, ball2.vx, ball2.vy); // Geschw. Ort 2
				ball2.vx = result[1];
				ball2.vy = result[2];
				if (result[0])
					{ //Startwerte merken
						vx02 = result[1];
						vy02 = result[2];
					}				
				v2 = result[3];
				alpha2 = result[4];
				
				Wkin = 0.5*m1*sq(v1) + 0.5*m2*sq(v2);
			}
		else
			{	/************************ Berechnung der Bewegung *****************************************/		

				switch(statusCounter)
					{
						case 0:   // bis zum Stoß  
						/* Bewegung Objekt K vor dem Stoß */
							if((sq(ball2.x-ball1.x)+sq(ball2.y-ball1.y)) <= sq(0.5*(ball1.d + ball2.d))) // ? Stoß ?
								{ /* Wechselwirkung im Stoß */
									if (!STOSS) 
										{
											dt = 0;
											STOSS = true;
											statusCounter++;
											beta = atan2(ball1.y-ball2.y, ball1.x-ball2.x);
										}
								}
							break;  
						
						case 1:  // im Stoßmoment (1)
							// zentrale und tangentiale Komponenten 								
							phi = beta - HALF_PI;
							result = rotCoordSystem(vx01, vy01, phi);
							v1T = result[0];
							v1Z = result[1];
							result = rotCoordSystem(vx02, vy02, phi);
							v2T = result[0];
							v2Z = result[1];
							ENABLE = true;                        // warten auf weiter-Button
							dt = 0;
							displayResultsBefore();
							break;
							
						case 2:  // im Stoßmoment (2)
							/* Energieübertragung */
							v1Z_= ((m1-m2)*v1Z+2*m2*v2Z)/(m1+m2); // Radialgeschwindigkeiten nach dem Stoß                   
							v1T_ = v1T;                           // Tangentialgeschwindigkeiten
							v1_ = sqrt(sq(v1Z_)+sq(v1T_));        // Betrag v1_
							gamma1 = atan2(v1T_,v1Z_);
							v2Z_= ((m2-m1)*v2Z+2*m1*v1Z)/(m1+m2);       
							v2T_ = v2T;                           // keine Änderung d. Tangentialk., da keine Wechselwirkung!
							v2_ = sqrt(sq(v2Z_)+sq(v2T_));        // Betrag v2_
							//gamma2 = atan2(v2T_,v2Z_);
							
							// x- u. y-Komponenten 
							result = rotCoordSystem(v1T_, v1Z_, -phi);
							v1x_ = result[0];
							v1y_ = result[1];
							result = rotCoordSystem(v2T_, v2Z_, -phi);
							v2x_ = result[0];
							v2y_ = result[1];
							v1y_ = v1y_ - v2y_;
							v2y_ = 0;
							result = rotCoordSystem(v2x_, v2y_, phi);
							v2T_ = result[0];
							v2Z_ = result[1];
							gamma2 = atan2(v2T_,v2Z_);
							ENABLE = true;                       // warten auf weiter-Button
							dt = 0;
							displayResultsAfter();
							Wkin_ = 0.5*m1*(sq(v1x_)+sq(v1y_)) + 0.5*m2*(sq(v2x_)+sq(v2y_));
							break;
					 
						case 3: // Nach dem Stoß   
						/* Bewegung der Objekte nach dem Stoß */ 
							DISPLAY = true;
							ENABLE = false;
							ball1.vx = v1x_;
							ball1.vy = v1y_;
							ball2.vx = v2x_;
							ball2.vy = v2y_;
							statusCounter++;							
						default: break;
					}

				ball1.x += ball1.vx*dt
				ball1.y += ball1.vy*dt;
				if (ball1.y < 0 && !TOUCH_1) 
					{
						TOUCH_1 = true;
						ball1.y = 0;
						ball1.vy = -ball1.vy;
					}
				ball2.x += ball2.vx*dt;
				ball2.y += ball2.vy*dt;
				if (ball2.y < 0 && !TOUCH_2) 
					{
						TOUCH_2 = true;
						ball2.y = 0;
						ball2.vy = -ball2.vy;
					}
				
				var fw = 0.5*fieldWidth, fh = 0.5*height/M;
				if (endProgram(ball1.x < -fw || ball1.x > fw || ball1.y < -fh || ball1.y > fh || ball2.x < -fw || ball2.x > fw || ball2.y < -fh || ball2.y > fh))
					{ /* Ende des Experiments */
						text("Ende der Bewegung ", kXi(0), kYi(-20));
					} 

			}
		
		/********************************************** Darstellung ************************************/
		stroke(0);								// solide Ebene
		strokeWeight(3);
		line(kXi(-0.4*fieldWidth*M), kYi(-0.5*ball2.d*M), kXi(0.4*fieldWidth*M), kYi(-0.5*ball2.d*M));
		strokeWeight(1);
		
		if (DISPLAY) 							// Stoßobjekt 1
			fill('#ffff00'); 
		else
			noFill();
		ellipse(kXi(ball1.x*M), kYi(ball1.y*M), ball1.d*M, ball1.d*M);
		
		if (DISPLAY) 							// Stoßobjekt 2
			fill('#00ffff'); 
		else
			noFill();
		ellipse(kXi(ball2.x*M), kYi(ball2.y*M), ball2.d*M, ball2.d*M);
		fill(0);
		textSize(1.6*fontSize);
		textAlign(CENTER, CENTER);
		text("B1", kXi(ball1.x*M), kYi(ball1.y*M));
		text("B2", kXi(ball2.x*M), kYi(ball2.y*M));		
		endProgram();	
	}	
	
function displayResultsBefore()
	{
		DISPLAY = false;
		fill(0);
		textSize(1.2*fontSize);
		displayLine("beta: "+formatNumber(degrees(beta),2,2)+"° alpha1: "+formatNumber(degrees(alpha1),2,2)+"° alpha2: "+formatNumber(degrees(alpha2),2,2)+"°", 255, "LEFT", 10, 90);
		displayLine("before collision", 255, "LEFT", 10, 70);
		displayLine("W: "+formatNumber(Wkin,2,2)+" Nm", 255, "LEFT", 10, 75);
		displayLine("v1: "+formatNumber(v1,2,2)+" m/s", 255, "LEFT", 10, 80);
		displayLine("v1Z: "+formatNumber(v1Z,2,2)+" m/s", '#0000ff', "LEFT", 25, 80);
		displayLine("v1T: "+formatNumber(v1T,2,2)+" m/s", '#00ff00', "LEFT", 40, 80);
		displayLine("v2: "+formatNumber(v2,2,2)+" m/s", 255, "LEFT", 10, 85);
		displayLine("v2Z: "+formatNumber(v2Z,2,2)+" m/s", '#ff00ff', "LEFT", 25, 85);
		displayLine("v2T: "+formatNumber(v2T,2,2)+" m/s", '#ffff00', "LEFT", 40, 85);
		displayArrow(ball1.x, ball1.y, M, v1, alpha1, N, 255, -1, "v1");                
		displayArrow(ball1.x, ball1.y, M, v1Z, (beta-PI), N, '#0000ff', -1, "v1Z");         
		if (v1T > 0)
			displayArrow(ball1.x, ball1.y, M, v1T, (beta-PI/2), N, '#00ff00', -1, "v1T");     
		else
			displayArrow(ball1.x, ball1.y, M, v1T, (beta+PI/2), N, '#00ff00', -1, "v1T");          

		displayArrow(ball2.x, ball2.y, M, v2, alpha2, N, 255, -1, "v2");             
		displayArrow(ball2.x, ball2.y, M, v2Z, (beta), N, '#ff00ff', -1,"v2Z");             
		if (v2T > 0)
			displayArrow(ball2.x, ball2.y, M, v2T, (beta-PI/2), N, '#ffff00', -1,"v2T");             
		else
			displayArrow(ball2.x, ball2.y, M, v2T, (beta+PI/2), N, '#ffff00', -1,"v2T");          


	}
	
function displayResultsAfter()
	{
		DISPLAY = false;
		fill(0);
		textSize(1.2*fontSize);
		displayLine("beta: "+formatNumber(degrees(beta),2,2)+"° alpha1: "+formatNumber(degrees(alpha1),2,2)+"° alpha2: "+formatNumber(degrees(alpha2),2,2)+"°", 255, "LEFT", 10, 90);
		displayLine("after collision", 255, "LEFT", 10, 70);
		displayLine("W': "+formatNumber(Wkin_,2,2)+" Nm", 255, "LEFT", 10, 75);
		displayLine("v1': "+formatNumber(v1_,2,2)+" m/s", 255, "LEFT", 10, 80);
		displayLine("v1x': "+formatNumber(v1x_,2,2)+" m/s", '#0000ff', "LEFT", 25, 80);
		displayLine("v1y': "+formatNumber(v1y_,2,2)+" m/s", '#00ff00', "LEFT", 40, 80);
		displayLine("v2': "+formatNumber(v2_,2,2)+" m/s", 255, "LEFT", 10, 85);
		displayLine("v2x': "+formatNumber(v2x_,2,2)+" m/s", '#ff00ff', "LEFT", 25, 85);
		displayLine("v2y': "+formatNumber(v2y_,2,2)+" m/s", '#ffff00', "LEFT", 40, 85);
		displayArrow(ball1.x, ball1.y, M, v1_, beta-gamma1, N, 255, 1, "v1'");                
		displayArrow(ball1.x, ball1.y, M, v1Z_, beta, N, '#0000ff', 1, "v1Z'");         
		if (v1T > 0)
			displayArrow(ball1.x, ball1.y, M, v1T_, beta-PI/2, N, '#00ff00', 1, "v1T'");     
		else
			displayArrow(ball1.x, ball1.y, M, v1T_, beta+PI/2, N, '#00ff00', 1, "v1T'");         

		displayArrow(ball2.x, ball2.y, M, v2_, beta-gamma2, N, 255, 1, "v2'");             
		displayArrow(ball2.x, ball2.y, M, v2Z_, beta-PI, N, '#ff00ff', 1, "v2Z'");             
		if (v2T > 0)
			displayArrow(ball2.x, ball2.y, M, v2T_, beta-PI/2, N, '#ffff00', 1, "v2T'");             
		else
			displayArrow(ball2.x, ball2.y, M, v2T_, beta+PI/2, N, '#ffff00', 1, "v2T'");          
	}

/********************************************** Funktionen ****************************************/

function rotCoordSystem(x, y, phi)
	{
		var u = x*cos(phi) + y*sin(phi); 	// tangentiale K.
		var v = -x*sin(phi) + y*cos(phi); // zentrale K.
		return [u, v];
	}


