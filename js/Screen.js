'use strict'

class CScreen
{
    constructor()
    {
        this.m_objects=[];
        this.m_screenMode=1;                                              //设定需要被显示的屏幕：0-地图，1-烧杯，2-合成台
    }

    Find(object)
    {
        var i=0;
        for(i=0;i<this.m_objects.length;i++)
        {
            if(this.m_objects[i]===object)
            {
                return i;
            }
        }
        return -1;
    }

    Hide(object)
    {
        var p=this.Find(object);
        if(p!=-1)
        {
            this.m_objects.splice(p,1);
            return true;
        }
        return false;
    }

    BringToTop(object)
    {
        if(this.Hide(object))
        {
            this.m_objects.push(object);
        }
    }

    Push(object)
    {
        var p=this.Find(object);
        if(p===-1)
        {
            this.m_objects.push(object);
        }
        else
        {
            this.BringToTop(object);
        }
    }

    Information()
    {
        var i=0;
        var info='';
        for(i=0;i<this.m_objects.length;i++)
        {
            info=info+i+'. '+this.m_objects[i].m_name+'\n';
        }
        return info;
    }

    OnWhichArea(sprite)
    {
        var i=0,j=0;
        for(i=0;i<this.m_objects.length;i++)
        {
            j=this.m_objects.length-1-i;                                    //所以是从后往前检测是否有重叠
            if(this.CheckOverlap(sprite,this.m_objects[j].m_image)===true)
            {
                return this.m_objects[j];
            }
        }
        return 'Background';
    }

    CheckOverlap(sprite1,sprite2)
    {
        var bound1=sprite1.getBounds();
        var bound2=sprite2.getBounds();

        return Phaser.Rectangle.intersects(bound1,bound2);
    }

    SwitchScreen(mode)
    {
        if(mode===1)
        {
            this.m_screenMode=1;
            var infoPage=document.getElementById('beaker-information');
            infoPage.innerHTML=beaker.Information(1);
            if(beaker.m_image===null)
            {
                beaker.LoadImage(game,'beaker',0.6,250,110,'space',85);
            }
            else if(beaker.m_image.visible===false)
            {
                beaker.VisibleEnable(true);
            }
            if(base.m_image!=null && base.m_image.visible===true)
            {
                base.VisibleEnable(false);
            }
            if(map.m_visible===true)
            {
                map.VisibleEnable(false);
            }
        }
        else if(mode===2)
        {
            this.m_screenMode=2;
            var infoPage=document.getElementById('beaker-information');
            infoPage.innerHTML=base.m_innerSpace.Information();
            if(base.m_image===null)
            {
                base.LoadImage(game,'base',0.5,226,145);
            }
            else if(base.m_image.visible===false)
            {
                base.VisibleEnable(true);
            }
            if(beaker.m_image!=null && beaker.m_image.visible===true)
            {
                beaker.VisibleEnable(false);
            }
            if(map.m_visible===true)
            {
                map.VisibleEnable(false);
            }
        }
        else
        {
            this.m_screenMode=0;
            if(map.m_visible===false)
            {
                map.VisibleEnable(true);
            }
            if(beaker.m_image!=null && beaker.m_image.visible===true)
            {
                beaker.VisibleEnable(false);
            }
            if(base.m_image!=null && base.m_image.visible===true)
            {
                base.VisibleEnable(false);
            }
        }
    }
}