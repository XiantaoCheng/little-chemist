'use strict'


class CMatter
{
    constructor(name,state)
    {
        this.m_number=1;
        if(state==='g' || state==='gas')
        {
            this.m_state='gas';
        }
        else if(state==='l' || state==='liquid')
        {
            this.m_state='liquid';
        }
        else if(state==='s' || state==='solid')
        {
            this.m_state='solid';
        }
        else if(state==='o' || state==='solute')
        {
            this.m_state='solute';
        }
        else if(state==='e' || state==='energy')
        {
            this.m_state='energy';
        }
        else if(state==='i' || state==='object')
        {
            this.m_state='object';
        }
        else
        {
            this.m_state=state;
        }
        this.m_reacted=0;
        this.m_name=name;

        //溶质
        this.m_solute=[];
        //溶剂
        this.m_solvent=null;
        //物品在烧杯中的位置
        this.m_pos=[];

        //物品的位置
        this.m_place='Background';
        this.m_image=null;
    }

    Copy(thing)
    {
        this.m_name=thing.m_name;
        this.m_state=thing.m_state;
        this.m_number=thing.m_number;
        this.m_reacted=thing.m_reacted;
        //溶质溶液的信息没有复制。位置信息也没有复制。图像也是。。
    }

    Discharge(name,number)
    {
        var j=0;
        var matters=[];
        var newS;

        if(name==='all')
        {
            matters=this.m_solute;
            for(j=0;j<matters.length;j++)
            {
                matters[j].m_solvent=null;
            }
            this.m_solute=[];
            return matters;
        }
        for(j=0;j<this.m_solute.length;j++)
        {
            if(this.m_solute[j].m_name===name)
            {
                if(this.m_solute[j].m_number-number<=0)
                {
                    matters.push(this.m_solute[j]);
                    this.m_solute[j].m_solvent=null;
                    this.m_solute.splice(j,1);
                }
                else
                {
                    newS=new CMatter(this.m_solute[j].m_name,this.m_solute[j].m_state);
                    newS.m_number=number;
                    this.m_solute[j].m_number-=number;
                    matters.push(newS);
                }
                break;
            }
        }
        return matters;
    }

    Dissolve(solute)
    {
        var j=0;
        var newS;

        for(j=0;j<this.m_solute.length;j++)
        {
            if(solute.m_name===this.m_solute[j].m_name)
            {
                this.m_solute[j].m_number+=solute.m_number;
                return this.m_solute[j];
            }
        }
        this.m_solute.push(solute);
        solute.m_solvent=this;
        solute.m_place=this.m_place;
        return solute;
    }

    Information()
    {
        return `Name: ${this.Name()}
State: ${this.m_state}
Number: ${this.m_number} mol
Reacted: ${this.m_reacted} mol`;
    }

    Name()
    {
        return this.m_name;
    }


    LoadImage(game,image_name,size)
    {
        this.m_image=game.add.sprite(0,0,image_name);
        this.m_image.inputEnabled=true;
        this.m_image.input.enableDrag();
        this.m_image.scale.setTo(size);
        this.m_image.events.onDragStart.add(this.OnDragStart,this);
        this.m_image.events.onDragStop.add(this.OnDragStop,this);
    }

    LoadImage_Auto()
    {
        var image_name=this.m_state;
        this.m_image=game.add.sprite(0,0,image_name);
        this.m_image.inputEnabled=true;
        this.m_image.input.enableDrag();
        this.m_image.scale.setTo(1);
        this.m_image.events.onDragStart.add(this.OnDragStart,this);
        this.m_image.events.onDragStop.add(this.OnDragStop,this);
        this.m_image.events.onDragUpdate.add(this.onDragUpdate,this);
        
        ResizeSprite(this.m_image,75,75);
    }

    OnDragStart()
    {
        if(this.m_place!='Background')
        {
            this.m_place.ThrowAway(this);
            game.world.add(this.m_image);
            if(userScreen.m_screenMode===1)
            {
                var infoPage=document.getElementById('beaker-information');
                infoPage.innerHTML=beaker.Information(1);
            }
            else if(userScreen.m_screenMode===2)
            {
                var infoPage=document.getElementById('beaker-information');
                infoPage.innerHTML=base.m_innerSpace.Information();
            }
        }
        game.world.bringToTop(this.m_image);
    }

    onDragUpdate()
    {
        game.world.bringToTop(this.m_image);
    }

    OnDragStop(image)
    {
        var x,y;
        var onArea=userScreen.OnWhichArea(image);
        var result;
        if(onArea.m_name==='Box')
        {
            this.m_image.destroy();
            delete this;
        }
        else if(onArea.m_name==='Base')
        {
            x=this.m_image.centerX-onArea.m_image.x;
            y=this.m_image.centerY-onArea.m_image.y;
            result=onArea.PutInto(this,x/onArea.m_scaleX,y/onArea.m_scaleY);
            if(result===2)
            {
                this.m_image.destroy();
                delete this;
            }
            else if(result===0)
            {
                map.PutInto(this);
            }
            else if(result===1)
            {
                var infoPage=document.getElementById('beaker-information');
                infoPage.innerHTML=base.m_innerSpace.Information();
            }
        }
        else if(onArea!='Background')               //其实是烧杯
        {
            x=this.m_image.centerX-onArea.m_image.x;
            y=this.m_image.centerY-onArea.m_image.y;
            result=onArea.PutInto(this,x/0.6,y/0.6);
            if(result===0)
            {
                map.PutInto(this);
            }
            else if(result===1)
            {
                var infoPage=document.getElementById('beaker-information');
                infoPage.innerHTML=beaker.Information(1);
            }
            if(this.m_state==='energy')
            {
                this.m_image.destroy();
                delete this;
            }
        }
        else
        {
            map.PutInto(this);
        }
    }
}


/*
module.exports=CMatter;
//*/