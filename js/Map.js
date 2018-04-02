'use strict'

class CMap
{
    constructor()
    {
        this.m_objects=[];                              //预期是CMatter类
        this.m_name='Map';
        this.m_visible=false;
    }

    Input(object)
    {
        if(object===null || object===undefined)
        {
            return false;
        }
        if(this.m_objects.indexOf(object)!=-1)          //有过的不会重复加入
        {
            return false;
        }
        this.m_objects.push(object);
        object.m_place=this;
        return true;
    }

    PutInto(object)
    {
        if(this.Input(object)===false)
        {
            return false;
        }
        if(object.m_image===null)
        {
            object.LoadImage_Auto();
        }
        game.world.add(object.m_image);
        if(this.m_visible===true)
        {
            object.m_image.visible=true;
        }
        else
        {
            if(object.m_image!=null)
            {
                object.m_image.visible=false;
            }
        }
        return true;
    }

    ThrowAway(object)
    {
        var i=this.m_objects.indexOf(object);
        if(i===-1)
        {
            return 0;
        }
        else
        {
            this.m_objects.splice(i,1);
            return object;
        }
    }

    VisibleEnable(switch_key)
    {
        var i=0;
        if(switch_key===true)
        {
            this.m_visible=true;
        }
        else
        {
            this.m_visible=false;
        }
        for(i=0;i<this.m_objects.length;i++)
        {
            if(switch_key===true)
            {
                this.m_objects[i].m_image.visible=true;
            }
            else
            {
                this.m_objects[i].m_image.visible=false;
            }
        }
    }
}