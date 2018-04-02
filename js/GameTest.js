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