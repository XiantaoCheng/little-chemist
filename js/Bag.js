'use strict'

class CBag
{
    constructor(name)
    {
        this.m_innerSpace=new CInnerSpace(3,3,30,30,true,name+'_section',0);
        this.m_name=name;

        this.m_image=null;
    }

    
    LoadImage(game,image_Bag,size_bag,image_BK,image_Space,size_section)
    {
        this.m_image=game.add.sprite(1130,640,image_Bag);
        this.m_image.scale.setTo(size_bag);
        this.m_image.inputEnabled=true;
        this.m_image.events.onInputDown.add(this.OnDown,this);

        //更屏幕信息
        userScreen.Push(this);

        this.m_innerSpace.LoadImage(game,image_BK,image_Space,size_section,600,400)
        this.m_innerSpace.VisibleEnable(false);
    }

    OnDown()
    {
        if(this.m_innerSpace.m_image.visible===true)
        {
            this.m_innerSpace.VisibleEnable(false);
        }
        else
        {
            this.m_innerSpace.VisibleEnable(true);
        }
    }
}