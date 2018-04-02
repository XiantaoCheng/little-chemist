'use strict'

class CBase
{
    constructor()
    {
        this.m_name='Base';
        this.m_width=300;
        this.m_height=300;
        this.m_scaleX=null;
        this.m_scaleY=null;
        this.m_nx=3;
        this.m_ny=3;
        this.m_spaceSize=180;
        this.m_innerSpace=new CInnerSpaceP(this.m_nx,this.m_ny,0);

        this.m_image=null;
    }

    Information()
    {
        return this.m_innerSpace.Information();
    }

    Synthesis()
    {
        var i=0;
        var reactants=this.m_innerSpace.MattersInBeaker();
        var items=world.Reaction(reactants,['Physics']);
        if(items[1]!=undefined)
        {
            box.UpdataItems(items[1]);
        }
        this.m_innerSpace.Empty();
    }

    LoadImage(game,image,image_size,x,y)
    {
        var spaceX,spaceY;
        this.m_image=game.add.sprite(x,y,image);
        ResizeSprite(this.m_image,this.m_width,this.m_height);
        userScreen.Push(this);
        this.m_scaleX=this.m_image.scale.x;
        this.m_scaleY=this.m_image.scale.y;
/*        
        this.m_image.inputEnabled=true;
        this.m_image.input.enableDrag();//*/

        spaceX=this.m_width/this.m_image.scale.x/2-this.m_spaceSize*(this.m_nx/2);
        spaceY=this.m_height/this.m_image.scale.y/2-this.m_spaceSize*(this.m_ny/2);
        this.m_innerSpace.LoadImage(game,'space',this.m_spaceSize,spaceX,spaceY);
        this.m_innerSpace.BecomePartOf(this);
    }

    //1：放到了空位上；2：合并了；0：没放成功
    PutInto(thing,x,y)
    {
        var space=this.m_innerSpace.PutInto_Base(thing,x,y);
        if(space!=0 && space.m_content===thing)
        {
            space.m_content.m_place=this;
            return 1;
        }
        else if(space!=0)
        {
            return 2;
        }
        return 0;
    }

    ThrowAway(thing)
    {
        return this.m_innerSpace.ThrowAway_Base(thing);
    }

    VisibleEnable(switch_key)
    {
        if(switch_key===true)
        {
            this.m_image.visible=true;
            game.world.bringToTop(this.m_image);
            
            //更屏幕信息
            userScreen.Push(this);
        }
        else if(switch_key===false)
        {
            this.m_image.visible=false;

            //更屏幕信息
            userScreen.Hide(this);
        }
    }
}