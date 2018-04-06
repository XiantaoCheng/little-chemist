'use strict'

//var CMatter=require('./Matter');

class CBox
{
    constructor()
    {
        this.m_name='Box';
        this.m_items=[];
        this.m_height=100;
        this.m_startHeight=0;
        this.m_scaleHeight=600;

        this.m_image=null;
    }

    Initialize()
    {
        this.InputThing('NaCl','s');
        this.InputThing('FeS2','s');
        this.InputThing('Al2O3','s');
        this.InputThing('CaCO3','s');
//        this.InputThing('CaSiO3','s');
//        this.InputThing('CaSO4','s');
//        this.InputThing('Na2SiO3','s');
        this.InputThing('SiO2','s');
        this.InputThing('Na3AlF6','s');
        this.InputThing('V2O5','s');
        this.InputThing('C','s');
//        this.InputThing('Fe','s');
//        this.InputThing('Al','s');
        this.InputThing('H2O','l');
        this.InputThing('O2','g');
//        this.InputThing('H2','g');
        this.InputThing('N2','g');
        this.InputThing('f','e');
        this.InputThing('H','e');
        this.InputThing('HT','e');
        this.InputThing('B','e');
        this.InputThing('P','e');
        this.InputThing('Clear','e');
    }

    Input(item)
    {
        var i=0;
        var newItem;

        if(item.m_name===undefined || item.m_name===null)
        {
            return;
        }
        newItem=new CMatter(item.m_name,item.m_state);
        
        for(i=0;i<this.m_items.length;i++)
        {
            if(this.CompareIndex(newItem.m_name,this.m_items[i].m_name)===1)
            {
                newItem.m_place=this;
                this.m_items.splice(i,0,newItem);
                return;
            }
        }

        newItem.m_place=this;
        this.m_items.push(newItem);
        return;
    }

    InputThing(item_name,item_state)
    {
        var thing=new CMatter(item_name,item_state);
        this.Input(thing);
    }

    //比较name1和name2的序号。0--序号相同，1--name1的序号靠前，2--name2的序号靠前
    CompareIndex(name1,name2)
    {
        var i=0;

        for(i=0;i<name1.length;i++)
        {
            if(name2[i]===undefined || name2[i]===null)
            {
                return 2;
            }
            if(name1[i]>name2[i])
            {
                return 2;
            }
            else if(name1[i]<name2[i])
            {
                return 1;
            }
        }

        if(name2[i]===undefined|| name2[i]===null)
        {
            return 0;
        }

        return 1;
    }

    IndexOf(item_name)
    {
        var i=0;
        for(i=0;i<this.m_items.length;i++)
        {
            if(this.m_items[i].m_name===item_name)
            {
                return i;
            }
        }
        return -1;
    }

    Information()
    {
        var info='Items: ';
        var i=0;

        for(i=0;i<this.m_items.length;i++)
        {
            info+=this.m_items[i].m_name;
            if(i<this.m_items.length-1)
            {
                info+=',';
            }
            else
            {
                info+='\n';
            }
        }

        return info;
    }

    UpdataItems(items)
    {
        var i=0;
        for(i=0;i<items.length;i++)
        {
            if(items[i].m_state==='solute')
            {
                continue;
            }
            if(this.IndexOf(items[i].m_name)===-1)
            {
                this.Input(items[i]);
            }
        }
        this.Renew();
    }

//图像及显示
    LoadImage_Auto()
    {
        this.m_image=game.add.sprite(750,0,'box');
        ResizeSprite(this.m_image,250,600,1);
        userScreen.Push(this);
        this.Renew();
    }

    Renew()
    {
        var i=0;
        var name;
        var style={font:"bold 16px Arial",fill:"#fff"};

        for(i=0;i<this.m_items.length;i++)
        {
            if(this.m_items[i].m_image===null)
            {
                this.m_items[i].LoadImage_Auto();
                this.m_image.addChild(this.m_items[i].m_image);
            }
            if(this.m_items[i].m_textImage===undefined)
            {
                name=this.Translate(this.m_items[i]);
                this.m_items[i].m_textImage=game.add.text(0,0,name,style);
                this.m_image.addChild(this.m_items[i].m_textImage);
            }
            this.m_items[i].m_image.x=20;
            this.m_items[i].m_image.y=i*this.m_height-this.m_startHeight+20;
            this.m_items[i].m_textImage.x=120;
            this.m_items[i].m_textImage.y=i*this.m_height-this.m_startHeight+30;
        }
    }

    //补丁：显示的时候条件的名字显示出来
    Translate(object)
    {
        var name=object.m_name;
        if(object.m_state==='energy')
        {
            if(object.m_name==='f')
            {
                name='Ignite';
            }
            else if(object.m_name==='B')
            {
                name='Discharge';
            }
            else if(object.m_name==='H')
            {
                name='Heat';
            }
            else if(object.m_name==='HT')
            {
                name='Extreme Heat';
            }
            else if(object.m_name==='P')
            {
                name='High Pressure';
            }
        }
        return name;
    }

    Scroll(n,direction)
    {
        var space=20;
        var start=this.m_startHeight;
        var scale=this.m_scaleHeight/this.m_image.scale.y-20;
        var total=this.m_height*this.m_items.length;

        if(direction===true)
        {
            if(start+space*n+scale<total+10)
            {
                start+=space*n;
            }
            else
            {
                start=total-scale+10;
            }
        }
        else
        {
            if(start-space*n>-10)
            {
                start-=space*n;
            }
            else
            {
                start=-10;
            }
        }

        this.m_startHeight=start;
        this.Renew();
    }

    ThrowAway(thing)
    {
        var i=this.m_items.indexOf(thing);
        if(i===-1)
        {
            return;
        }
        var copyThing=new CMatter();
        copyThing.Copy(thing);

        thing.m_place='Background';
        if(thing.m_textImage!=undefined)
        {
            thing.m_textImage.visible=false;
            delete thing.m_textImage;
        }
        this.m_items.splice(i,1);
        this.Input(copyThing);

        this.Renew();
    }
}


