var game=new Phaser.Game(1000,600,Phaser.AUTO,'example', { preload: preload, create: create, update: update});

var background;
var box;
var beaker;
var base;
var map;

var keySpace;
var keyUp;
var keyDown
var keyRight;
var keyLeft;
var keyPageUp;
var keyPageDown;
var keyC;


function preload()
{
    game.load.pack('Backgrounds', 'json/assets_beaker.json', null, this);
    game.load.pack('Buttons', 'json/assets_beaker.json', null, this);
    game.load.pack('Objects', 'json/assets_beaker.json', null, this);
}

function create()
{
    userScreen=new CScreen();
    world=new CChemLaws(book);

    background=game.add.image(0,0,'background');
    ResizeSprite(background,1000,600,1);

    var a=new CInnerSpaceP(3,3,0,1);

    box=new CBox;

    box.LoadImage_Auto();
    box.Initialize();
    box.Renew();

    beaker=new CInnerSpace(5,6,15,0,false,'beaker',1);
    beaker.LoadImage(game,'beaker',0.6,250,110,'space',85);

    base=new CBase();
    base.LoadImage(game,'base',0.5,226,145);

    map=new CMap();

    keyUp=this.input.keyboard.addKey(Phaser.KeyCode.UP);
    keyDown=this.input.keyboard.addKey(Phaser.KeyCode.DOWN);
    keyPageUp=this.input.keyboard.addKey(Phaser.KeyCode.PAGE_UP);
    keyPageDown=this.input.keyboard.addKey(Phaser.KeyCode.PAGE_DOWN);

    userScreen.SwitchScreen(0);

    keyRight=this.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
    keyLeft=this.input.keyboard.addKey(Phaser.KeyCode.LEFT);
    keySpace=this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    keyC=this.input.keyboard.addKey(Phaser.KeyCode.C);
    keyRight.onDown.add(ShiftR,this);
    keyLeft.onDown.add(ShiftL,this);
    keySpace.onDown.add(Reaction,this);
    keyC.onDown.add(Clear,this);

    InitializeButton();
}

function update()
{
    if(keyUp.isDown)
    {
        box.Scroll(1,false);
    }
    if(keyDown.isDown)
    {
        box.Scroll(1,true);
    }
    if(keyPageUp.isDown)
    {
        box.Scroll(30,false);
    }
    if(keyPageDown.isDown)
    {
        box.Scroll(30,true);
    }
}

function ShiftR()
{
    userScreen.SwitchScreen((userScreen.m_screenMode+1)%3);
}

function ShiftL()
{
    userScreen.SwitchScreen((userScreen.m_screenMode+2)%3);
}

function Reaction()
{
    if(userScreen.m_screenMode===1)
    {
        beaker.ChemistryRun(world);
        beaker.PhysicRun();
        beaker.RenewImage();
        var infoPage=document.getElementById('beaker-information');
        infoPage.innerHTML=beaker.Information(1);
    }
    if(userScreen.m_screenMode===2)
    {
        base.Synthesis();
        var infoPage=document.getElementById('beaker-information');
        infoPage.innerHTML=base.m_innerSpace.Information(1);
    }
}

function Clear()
{
    if(userScreen.m_screenMode===1)
    {
        beaker.m_environment=[];
        var infoPage=document.getElementById('beaker-information');
        infoPage.innerHTML=beaker.Information(1);
    }
}

var button_toBase;
var button_toBeaker;
var button_up;
var button_down;
var button_action;
var button_synthesis;

function Shift2Base()
{
    if(userScreen.m_screenMode!=2)
    {
        userScreen.SwitchScreen(2);
    }
    else
    {
        userScreen.SwitchScreen(0)
    }
}

function Shift2Beaker()
{
    if(userScreen.m_screenMode!=1)
    {
        userScreen.SwitchScreen(1);
    }
    else
    {
        userScreen.SwitchScreen(0)
    }
}

function ScrollDown()
{
    box.Scroll(30,true);
}

function ScrollUp()
{
    box.Scroll(30,false);
}

function InitializeButton()
{
    button_toBase=game.add.button(0,530,'Button_toBase',Shift2Base,this);
    ResizeSprite(button_toBase,70,70);
    button_toBeaker=game.add.button(70,530,'Button_toBeaker',Shift2Beaker,this);
    ResizeSprite(button_toBeaker,70,70);
    button_up=game.add.button(750,0,'Button_up',Clear,this);
    ResizeSprite(button_up,250,20,1);
    button_up.onInputDown.add(ScrollUp);
    button_down=game.add.button(750,580,'Button_down',Clear,this);
    ResizeSprite(button_down,250,20,1);
    button_down.onInputDown.add(ScrollDown);
    button_action=game.add.button(44,523,'Button_action',Reaction,this);
    beaker.m_image.addChild(button_action);
    button_synthesis=game.add.button(640,242,'Button_synthesis',Reaction,this);
    base.m_image.addChild(button_synthesis);
}