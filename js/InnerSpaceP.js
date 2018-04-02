'use strict'

//var CMatter=require('./Matter.js');

class CInnerSpaceP
{
    constructor(width,height,type,testMode)
    {
        var i=0,j=0;

        this.m_width=width;
        this.m_height=height;
        this.m_space=Array();
        this.m_spaceSize=91;
        this.m_spaceX=0;
        this.m_spaceY=0;

        for(i=0;i<this.m_width;i++)
        {
            this.m_space[i]=Array();
            for(j=0;j<this.m_height;j++)
            {
                this.m_space[i][j]={};
                this.m_space[i][j].m_background=null;
                this.m_space[i][j].m_content=null;
                this.m_space[i][j].m_tmpCon=[];
            }
        }

        this.m_type=type;                                      //0-背包模式；1-烧杯模式

        this.m_environment='f';

        this.m_image=null;
        this.m_place=null;
        if(testMode===true)
        {
            this.m_testMode=true;
        }
        else
        {
            this.m_testMode=false;
        }
    }

    CheckSpace(thing)
    {
        var i=0,j=0;
        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                if(this.m_space[i][j].m_content==thing)
                {
                    return [i,j];
                }
            }
        }
        return [null,null];
    }

    Empty()
    {
        var i,j;
        var item;
        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                if(this.m_space[i][j].m_content!=null)
                {
                    item=this.m_space[i][j].m_content;
                    this.m_space[i][j].m_content=null;
                    if(item.m_image!=null)
                    {
                        item.m_image.destroy();
                    }
                }
            }
        }
    }

    //解决背包中的物品重叠的问题(可以引起同类物品间的合并，但是先就只做弹飞的效果)
    //和目标物质相同的物质也是空位
    EmptySpace(thing)
    {
        var i,j;
        var space;
        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                space=this.m_space[i][j];
                if(this.m_space[i][j].m_content==null)
                {
                    return [i,j];
                }
                else if(space.m_content.m_name===thing.m_name && space.m_content.m_state===thing.m_state)
                {
                    return [i,j];
                }
            }
        }
        return -1;
    }

    Information()
    {
        var i,j,k,l,n;
        var info='';
        var space;

        var solute=[];
        var newS;

        for(j=0;j<this.m_height;j++)
        {
            for(i=0;i<this.m_width;i++)
            {
                space=this.m_space[i][j];
                if(this.m_space[i][j].m_content!=null)
                {
                    info=info+`${space.m_content.Name()}[${space.m_content.m_number}]`;
                }
                else
                {
                    info=info+'0 ';
                }
            }
            info=info+'<br/>\n';
        }

        return info;
    }

    //输出物品放入的格子，以便于在base中修改物品的位置
    Input_Base(thing,pi,pj)
    {
        var space=this.m_space[pi][pj];
        var pos;
        if(space.m_content===null)
        {
            space.m_content=thing;
            thing.m_pos=[pi,pj];
        }
        else if(space.m_content.m_name===thing.m_name && space.m_content.m_state===thing.m_state)
        {
            space.m_content.m_number+=thing.m_number;
        }
        else
        {
            pos=this.EmptySpace(thing);
            if(pos===-1)
            {
                return 0;
            }
            return this.Input_Base(thing,pos[0],pos[1]);
        }
        return space;
    }

    //统计烧杯中物质的数量
    MattersInBeaker()
    {
        var i=0,j=0,k=0;
        var matter_test;
        var matter_new;
        var matters=[];
        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                matter_test=this.m_space[i][j].m_content;
                if(matter_test===null)
                {
                    continue;
                }
                for(k=0;k<matters.length;k++)
                {
                    if(matters[k].Name()===matter_test.Name())
                    {
                        matters[k].m_number+=matter_test.m_number;
                        break;
                    }
                }
                if(k===matters.length)
                {
                    matter_new=new CMatter(matter_test.Name(), matter_test.m_state);
                    matter_new.m_number=matter_test.m_number;
                    matters.push(matter_new);
                }
            }
        }
        return matters;
    }
    
//显示图片类的函数
    ArrayToPosition(image,i,j)
    {
        var x,y;
        x=this.m_spaceX+this.m_spaceSize*0.5-image.width*0.5+i*this.m_spaceSize;
        y=this.m_spaceY+this.m_spaceSize*0.5-image.height*0.5+j*this.m_spaceSize;
        return [x,y];
    }

    BecomePartOf(thing)
    {
        var i,j;
        var space;

        this.m_place=thing;

        if(thing.m_image!=null)
        {
            for(i=0;i<this.m_width;i++)
            {
                for(j=0;j<this.m_height;j++)
                {
                    space=this.m_space[i][j];
                    if(space.m_background!=null)
                    {
                        thing.m_image.addChild(space.m_background);
                    }
                }
            }
        }
    }

    Destroy(thing)
    {
        if(thing.m_image!=null)
        {
            thing.m_image.destroy();
        }
    }

//*
    LoadImage(game,image_Space,size_space,x,y)
    {
        var pos;
        var i=0,j=0;

        this.m_spaceSize=size_space;
        this.m_spaceX=x;
        this.m_spaceY=y;

        //放置格子
        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                this.m_space[i][j].m_background=game.add.sprite(0,0,image_Space);
                ResizeSprite(this.m_space[i][j].m_background,this.m_spaceSize,this.m_spaceSize);
                pos=this.ArrayToPosition(this.m_space[i][j].m_background,i,j);
                this.m_space[i][j].m_background.position.setTo(pos[0],pos[1]);
                //this.m_space[i][j].m_background.inputEnabled=true;
                //this.m_space[i][j].m_background.input.enableDrag();
            }
        }
    }
    //*/

    OnDragStart()
    {
        game.world.bringToTop(this.m_image);

        //更屏幕信息
        userScreen.Push(this);
    }

    //物品从烧杯满了的里面溢出来了
    OutOfBeaker(thing)
    {
        thing.m_place='Background';
        if(this.m_testMode===false)
        {
            if(thing.m_image===null)
            {
                thing.LoadImage_Auto();
            }
            game.world.add(thing.m_image);
        }
    }

    PositionToArray(x,y)
    {
        var i=parseInt((x-this.m_spaceX)/this.m_spaceSize);
        var j=parseInt((y-this.m_spaceY)/this.m_spaceSize);
        if(i<0)
        {
            i=0;
        }
        else if(i>this.m_width-1)
        {
            i=this.m_width-1;
        }
        if(j<0)
        {
            j=0;
        }
        else if(j>this.m_height-1)
        {
            j=this.m_height-1;;
        }
        return [i,j];
    }

    PutInto_Base(thing,x,y)
    {
        var p=this.CheckSpace(thing);
        var space;
        if(p[0]!=null)
        {
            this.m_space[p[0]][p[1]].m_content=null;
            thing.m_pos=[];
        }
        p=this.PositionToArray(x,y);
        space=this.Input_Base(thing,p[0],p[1]);
        this.RenewImage();
        return space;
    }

    RenewImage()
    {
        var i,j;
        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                if(this.m_space[i][j].m_content!=null)
                {
                    this.ShowThing(i,j);
                }
            }
        }
    }

    ShowThing(pi,pj)
    {
        var pos;
        var space=this.m_space[pi][pj];
        var thing=space.m_content;
        if(thing==null)
        {
            return false;
        }
        if(thing.m_image===null)
        {
            thing.LoadImage_Auto();
        }
        if(this.m_place.m_image.children.indexOf(thing.m_image)===-1)
        {
            this.m_place.m_image.addChild(thing.m_image);
        }
        pos=this.ArrayToPosition(thing.m_image,pi,pj);
        if(pos[0]!=thing.m_image.x || pos[1]!=thing.m_image.y)
        {
            thing.m_image.position.setTo(pos[0],pos[1]);
        }
        return true;
    }

    ThrowAway_Base(thing)
    {
        var p=this.CheckSpace(thing);
        if(p[0]!=null)
        {
            this.m_space[p[0]][p[1]].m_content=null;
            thing.m_pos=[];
        }
        return thing;
    }

}

//module.exports=CInnerSpaceP;
/*
var a=new CInnerSpaceP(3,3,0);

var PutIn=function(name,state,pi,pj)
{
    var m=new CMatter(name,state);
    a.Input_Base(m,pi,pj);
    console.log(a.Information());
}

PutIn('H2O','l',0,0);
PutIn('H2O','l',1,0);
PutIn('H2O','l',2,0);
PutIn('H2O','l',0,1);
PutIn('H2O','l',1,1);
PutIn('H2O','l',2,1);
PutIn('H2O','l',2,2);
PutIn('H2O','l',0,2);
PutIn('H2O','l',1,2);
PutIn('H2O','g',2,2);//*/