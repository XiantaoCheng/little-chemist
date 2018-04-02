'use strict'
/*
var CMatter=require('./Matter.js');
var world=require('./Laws.js');
//*/

class CInnerSpace
{
    constructor(width,height,sx,sy,drag_mode,name,type)
    {
        var i=0,j=0;

        this.m_width=width;
        this.m_height=height;
        this.m_space=Array();
        this.m_spaceSize=91;
        this.m_spaceX=sx;
        this.m_spaceY=sy;

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

        this.m_drag=drag_mode;
        this.m_name=name;
        this.m_environment=['f'];

        this.m_solute=[];

        this.m_image=null;
    }

    //烧杯中的物理系统
    BeakerObject(thing,pi,pj)
    {
        var i,j;
        var tmpi=null;
        //固体的物理系统
        if(thing.m_state==='solid')
        {
            for(j=0;j<this.m_height;j++)
            {
                if(this.m_space[pi][j].m_content!=null && this.m_space[pi][j].m_content.m_state==='solid')
                {
                    if(j-1<0)
                    {
                        return false;
                    }
                    else
                    {
                        break;
                    }
                }
            }
            this.Input(thing,pi,j-1,0);
            return true;
        }
        //液体的物理系统
        if(thing.m_state==='liquid')
        {
            for(j=this.m_height-1;j>=0;j--)
            {
                for(i=0;i<this.m_width;i++)
                {
                    if(this.m_space[i][j].m_content===null || this.m_space[i][j].m_content.m_state==='gas')
                    {
                        if(tmpi===null || Math.abs(tmpi-pi)>Math.abs(i-pi))
                        {
                            tmpi=i;
                        }
                    }
                }
                if(tmpi!=null)
                {
                    this.Input(thing,tmpi,j,0);
                    return true;
                }
            }
        }
        //气体的物理系统
        if(thing.m_state==='gas')
        {
            for(j=pj;j>=0;j--)
            {
                if(this.m_space[pi][j].m_content===null || this.m_space[pi][j].m_content.m_state==='gas')
                {
                    this.Input(thing,pi,j,0);
                    return true;
                }
            }
        }

        return false;
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

    //检测当前物质在物品栏中的状态以及位置
    Condition(thing)
    {
        var i,j,k;
        var space;
        var pos=[];
        var info;

        info='Steady';

        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                space=this.m_space[i][j];
                if(space.m_content===thing)
                {
                    pos=[i,j,-1];
                }
                else
                {
                    for(k=0;k<space.m_tmpCon.length;k++)
                    {
                        if(space.m_tmpCon[k]===thing)
                        {
                            pos=[i,j,k];
                        }
                    }
                }
            }
        }

        if(pos===null)
        {
            info='OutOfSpace';
        }

        if(pos[2]!=-1)
        {
            info='Repelling';
        }

        //固体的漂浮条件
        if(thing.m_state==='solid')
        {
            if(pos[1]<this.m_height-1)
            {
                if(this.m_space[pos[0]][pos[1]+1].m_content==null)
                {
                    info='Floating';
                }
                else if(this.m_space[pos[0]][pos[1]+1].m_content.m_state!='solid')
                {
                    info='Floating';
                }
            }
        }
        else if(thing.m_state==='liquid')
        {
            if(pos[1]<this.m_height-1)
            {
                for(i=0;i<this.m_width;i++)
                {
                    space=this.m_space[i][pos[1]+1];
                    if(space.m_content===null || space.m_content.m_state==='gas')
                    {
                        info='Flowing';
                    }
                }
            }
        }

        return [info,pos];
    }

    //解决背包中的物品重叠的问题(可以引起同类物品间的合并，但是先就只做弹飞的效果)
    EmptySpace()
    {
        var i,j;
        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                if(this.m_space[i][j].m_content==null)
                {
                    return [i,j];
                }
            }
        }
        return -1;
    }

    Information(mode)
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
                    //显示溶质
                    for(l=0;l<space.m_content.m_solute.length;l++)
                    {
                        for(n=0;n<solute.length;n++)
                        {
                            if(solute[n].m_name===space.m_content.m_solute[l].m_name)
                            {
                                solute[n].m_number+=space.m_content.m_solute[l].m_number;
                                break;
                            }
                        }
                        if(n===solute.length)
                        {
                            newS=new CMatter(space.m_content.m_solute[l].m_name,space.m_content.m_solute[l].state);
                            newS.m_number=space.m_content.m_solute[l].m_number;
                            newS.m_reacted=space.m_content.m_solute[l].m_reacted;
                            solute.push(newS);
                        }
                    }
                }
                else
                {
                    info=info+'0 ';
                }
                for(k=0;k<this.m_space[i][j].m_tmpCon.length;k++)
                {
                    if(k===0)
                    {
                        info=info+'(';
                    }
                    info=info+`${space.m_tmpCon[k].Name()}[${space.m_tmpCon[k].m_number}]`;
                    if(k===this.m_space[i][j].m_tmpCon.length-1)
                    {
                        info=info+')';
                    }
                    else
                    {
                        info=info+',';
                    }
                }
                info=info+' ';
            }
            if(mode===1)
            {
                info+='<br/>';
            }
            else
            {
                info+='\n';
            }
        }

        info=info+'Solutes: ';
        for(l=0;l<solute.length;l++)
        {
            info+=`${solute[l].m_name}[${solute[l].m_number}] `;
        }
        if(mode===1)
        {
            info+='<br/>';
        }
        else
        {
            info+='\n';
        }
        //显示烧杯状态
        info+='Environment: ';
        for(i=0;i<this.m_environment.length;i++)
        {
            info+=this.m_environment[i];
            if(i<this.m_environment.length-1)
            {
                info+=','
            }
            else
            {
                info+='<br/>';
            }
        }

        return info;
    }

    Input(thing,pi,pj,show_mode)
    {
        var pos;
        if(this.m_space[pi][pj].m_content!=null)
        {
            this.m_space[pi][pj].m_tmpCon.push(this.m_space[pi][pj].m_content);
        }
        this.m_space[pi][pj].m_content=thing;
        thing.m_pos=[pi,pj];

        thing.m_place=this;

        if(show_mode===1)
        {
            this.ShowThing(pi,pj);
        }
    }

    Input_Beaker(thing,pi,pj)
    {
        if(this.BeakerObject(thing,pi,pj))
        {
            this.PhysicRun();
            return 1;
        }
        return 0;
    }

    //energy就只是状态为'energy'的CMatter而已！
    Input_Energy(energy)
    {
        var i;
        for(i=0;i<this.m_environment.length;i++)
        {
            if(energy.m_name==this.m_environment[i])
            {
                return 2;
            }
        }
        this.m_environment.push(energy.m_name);
        return 1;
    }

    Leave(thing,pi,pj)
    {
        var i=this.m_space[pi][pj].m_tmpCon.indexOf(thing);
        if(this.m_space[pi][pj].m_content===thing)
        {
            this.m_space[pi][pj].m_content=null;
            thing.m_place='Background';
            return true;
        }
        else if(i!=-1)
        {
            this.m_space[pi][pj].m_tmpCon.splice(i,1);
            thing.m_place='Background';
            return true;
        }
        return false;
    }

    Motion(thing,pi,pj)
    {
        if(thing===null)
        {
            return false;
        }
        else if(thing.m_state==='solid')
        {
            return this.Motion_Solid(thing,pi,pj);
        }
        else if(thing.m_state==='liquid')
        {
            return this.Motion_Liquid(thing,pi,pj);
        }
        else if(thing.m_state==='gas')
        {
            return this.Motion_Gas(thing,pi,pj);
        }
    }

    Motion_Gas(thing,pi,pj)
    {
        var j;
        //气体只有在处于排开位置的时候，才会发生运动
        if(thing===this.m_space[pi][pj].m_content)
        {
            return false;
        }
        this.Leave(thing,pi,pj);
        pj--;
        for(j=pj;j>=0;j--)
        {
            if(this.m_space[pi][j].m_content===null || this.m_space[pi][j].m_content.m_state==='gas')
            {
                this.Input(thing,pi,j,0);
                return true;
            }
        }

        this.OutOfBeaker(thing);
        return false;                                   //烧杯满了怎么办？
    }

    Motion_Liquid(thing,pi,pj)
    {
        var i,j;
        var tmpi=null;
        var state=this.Condition(thing)[0];
        if(state==='Steady')
        {
            return false;
            
        }

        this.Leave(thing,pi,pj);
        for(j=this.m_height-1;j>=0;j--)
        {
            for(i=0;i<this.m_width;i++)
            {
                if(this.m_space[i][j].m_content===null || this.m_space[i][j].m_content.m_state==='gas')
                {
                    if(tmpi===null || Math.abs(tmpi-pi)>Math.abs(i-pi))
                    {
                        tmpi=i;
                    }
                }
            }
            if(tmpi!=null)
            {
                this.Input(thing,tmpi,j,0);
                return true;
            }
        }
        this.OutOfBeaker(thing);
        return false;                                   //烧杯满了怎么办？
    }

    Motion_Solid(thing,pi,pj)
    {
        var j;
        var state=this.Condition(thing)[0];

        if(state==='Steady')
        {
            return false;
        }

        this.Leave(thing,pi,pj);

        if(state==='Floating')
        {
            for(j=pj;j<this.m_height;j++)
            {
                if(j+1===this.m_height)
                {
                    this.Input(thing,pi,j,0);
                    return true;
                }
                else if(this.m_space[pi][j+1].m_content!=null && this.m_space[pi][j+1].m_content.m_state==='solid')
                {
                    this.Input(thing,pi,j,0);
                    return true;
                }
            }
        }
        else if(state==='Repelling')
        {
            if(this.m_space[pi][pj].m_content===null || this.m_space[pi][pj].m_content.m_state!='solid')
            {
                this.Input(thing,pi,pj,0);
                return true;
            }
            if(pj!=0)
            {
                this.Input(thing,pi,pj-1,0);
                return true;
            }
            if(pi>0)
            {
                if(this.m_space[pi-1][pj].m_content===null || this.m_space[pi-1][pj].m_content.m_state!='solid')
                {
                    this.Input(thing,pi-1,pj,0);
                    this.Motion_Solid(thing,pi-1,pj);
                    return true;
                }
            }
            if(pi<this.m_width-1)
            {
                if(this.m_space[pi+1][pj].m_content===null || this.m_space[pi+1][pj].m_content.m_state!='solid')
                {
                    this.Input(thing,pi+1,pj,0);
                    this.Motion_Solid(thing,pi+1,pj);
                    return true;
                }
            }
        }
        this.OutOfBeaker(thing);
        return false;
    }

    Output(pi,pj)
    {
        var thing=this.m_space[pi][pj].m_content;
        this.m_space[pi][pj].m_content=null;
        thing.m_place='Background';
        thing.m_pos=[];

        return thing;
    }

    //重写物理系统
    PhysicRun()
    {
        var i,j,n;
        var change,end=true;
        var thing;

        while(1)
        {
            for(i=0;i<this.m_width;i++)
            {
                for(j=0;j<this.m_height;j++)
                {
                    thing=this.m_space[i][j].m_content;
                    if(this.Motion(thing,i,j))
                    {
                        end=false;
                        change=true;
                    }
                    while(this.m_space[i][j].m_tmpCon.length>0)    //从后往前处理被排开的物质
                    {
                        thing=this.m_space[i][j].m_tmpCon[0];
                        if(this.Motion(thing,i,j))
                        {
                            end=false;
                            change=true;
                        }
                    }
                }
            }
            if(end===true)
            {
                break;
            }
            else
            {
                end=true;
            }
        }

        return true;
    }

//烧杯中的化学系统
    //在某个位置处一个一个地输入物质的函数
    Appear(name,state,number,pos)
    {
        var thing;

        while(1)
        {
            if(number>1)
            {
                thing=new CMatter(name,state);
                this.Input(thing,pos[0],pos[1],0);
                number--;
            }
            else if(number>0)
            {
                thing=new CMatter(name,state);
                thing.m_number=number;
                this.Input(thing,pos[0],pos[1],0);
                return;
            }
            else
            {
                return;
            }
        }
    }

    //溶质出现（之后有机会把m_solute数据做得更有组织一些）
    Appear_Solute(name,state,number,solvent)
    {
        var rate=number/this.MatterNumber(solvent,'liquid');
        var i=0;
        var j=0;
        var matter;
        var solute;
        var space;

        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                space=this.m_space[i][j];
                if(space.m_content!=null && space.m_content.m_name===solvent)
                {
                    matter=new CMatter(name,state);
                    matter.m_number=rate*space.m_content.m_number;
                    solute=space.m_content.Dissolve(matter);
                    if(solute===matter)
                    {
                        this.m_solute.push(matter);
                    }
                }
            }
        }
    }

    ChemistryRun(world)
    {
        var i=0;
        var reactants=this.MattersInBeaker();
        var products=[];
        var newPos=[];
        var pos=[];

        var matters=world.Reaction(reactants,this.m_environment);
        if(matters[1]!=undefined)
        {
            products=matters[1];
            box.UpdataItems(products);
            for(i=0;i<reactants.length;i++)
            {
                newPos=this.Consume(reactants[i].Name(),reactants[i].m_state,reactants[i].m_reacted);
                pos=pos.concat(newPos);
            }
            for(i=0;i<products.length;i++)
            {
                this.Generate(products[i].Name(),products[i].m_state,products[i].m_number,pos);
            }
            return true;
        }
        
        return false;
    }

    
    //将烧杯中的某种物质反应掉多少mol
    Consume(name,state,number)
    {
        if(state==='solute')
        {
            return this.Consume_Solute(name,number);
        }
        else
        {
            return this.Consume_Default(name,state,number);
        }
    }

    Consume_Default(name,state,number)
    {
        var reacted=number;
        var pos=this.PosOfMatter(name,state,1);
        var i=0;
        var thing;
        var pos_act=[];
        var disappear;

        for(i=0;i<pos.length;i++)
        {
            thing=this.m_space[pos[i][0]][pos[i][1]].m_content;
            pos_act.push(pos[i]);
            if(thing.m_number-reacted>0)
            {
                thing.m_number-=reacted;
                return pos_act;
            }
            else if(thing.m_number-reacted===0)
            {
                thing.m_number=0
                disappear=this.Output(pos[i][0],pos[i][1]);
                this.Destroy(disappear);
                return pos_act;
            }
            else
            {
                reacted-=thing.m_number;
                thing.m_number=0;
                disappear=this.Output(pos[i][0],pos[i][1]);
                this.Destroy(disappear);
            }
        }

        //接着反应掉整数的物质
        pos=this.PosOfMatter(name,state,0);

        for(i=0;i<pos.length;i++)
        {
            thing=this.m_space[pos[i][0]][pos[i][1]].m_content;
            pos_act.push(pos[i]);
            if(thing.m_number-reacted>0)
            {
                thing.m_number-=reacted;
                return pos_act;
            }
            else if(thing.m_number-reacted===0)
            {
                thing.m_number=0
                disappear=this.Output(pos[i][0],pos[i][1]);
                this.Destroy(disappear);
                return pos_act;
            }
            else
            {
                reacted-=thing.m_number;
                thing.m_number=0;
                disappear=this.Output(pos[i][0],pos[i][1]);
                this.Destroy(disappear);
            }
        }
        return pos_act;
    }

    //消耗溶质
    Consume_Solute(name,number)
    {
        var i=0;
        var n=this.MatterNumber_Solute(name);
        var rate=number/n;
        var pos=this.PosOfMatter_Solute(name);

        if(n-number<1e-10)
        {
            for(i=0;i<this.m_solute.length;i++)
            {
                if(this.m_solute[i].m_name===name)
                {
                    this.m_solute[i].m_solvent.Discharge(name,number);            //确保归零
                    this.m_solute.splice(i,1);
                    i--;
                }
            }
        }
        else
        {
            for(i=0;i<this.m_solute.length;i++)
            {
                if(this.m_solute[i].m_name===name)
                {
                    this.m_solute[i].m_number-=rate*this.m_solute[i].m_number;
                }
            }
        }
        return pos;
    }

    //在烧杯中的某些位置上产生出某种物质
    Generate(name,state,number,pos)
    {
        if(state==='solute')
        {
            return this.Appear_Solute(name,state,number,'H2O');
        }
        else
        {
            return this.Generate_Default(name,state,number,pos);
        }
    }

    Generate_Default(name,state,number,pos)
    {
        var pos_old=this.PosOfMatter(name,state,1);
        var i=0;
        var generate=number;
        var thing;
        var np=pos.length;
        var g,m,n,point;

        if(np===0)
        {
            return false;
        }

        //将烧杯中不是整数的物质补成整数
        for(i=0;i<pos_old.length;i++)
        {
            thing=this.m_space[pos_old[i][0]][pos_old[i][1]].m_content;
            if(thing.m_number+generate>1)
            {
                generate-=(1-thing.m_number);
                thing.m_number=1;
            }
            else
            {
                thing.m_number+=generate;
                return true;
            }
        }

        //在目标位置上均匀地产生新物质
        g=Math.floor(generate);
        point=generate-g;
        m=Math.floor(g/np);
        n=g%np;

        for(i=0;i<pos.length;i++)
        {
            if(i===0)
            {
                this.Appear(name,state,m+point,pos[i]);
            }
            else if(i<=n)
            {
                this.Appear(name,state,m+1,pos[i]);
            }
            else
            {
                this.Appear(name,state,m,pos[i]);
            }
        }
        return true;
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

        //然后是烧杯中的溶质的数目
        for(i=0;i<this.m_solute.length;i++)
        {
            for(j=0;j<matters.length;j++)
            {
                if(matters[j].Name()===this.m_solute[i].Name() && matters[j].m_state===this.m_solute[i].m_state)
                {
                    matters[j].m_number+=this.m_solute[i].m_number;
                    break;
                }
            }
            if(j===matters.length)
            {
                matter_new=new CMatter(this.m_solute[i].Name(),this.m_solute[i].m_state);
                matter_new.m_number=this.m_solute[i].m_number;
                matters.push(matter_new);
            }
        }
        return matters;
    }

    //某个名字的物质在烧杯中有多少
    MatterNumber(name,state)
    {
        var i=0;
        var j=0;
        var number=0;
        var space;

        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                space=this.m_space[i][j];
                if(space.m_content!=null && space.m_content.m_name===name && space.m_content.m_state===state)
                {
                    number+=space.m_content.m_number;
                }
            }
        }
        return number;
    }

    //统计烧杯中溶质的数量
    MatterNumber_Solute(name)
    {
        var i=0;
        var number=0;

        for(i=0;i<this.m_solute.length;i++)
        {
            if(this.m_solute[i].m_name===name)
            {
                number+=this.m_solute[i].m_number;
            }
        }
        return number;
    }

    //搜索具有某种名字某种状态的物质在烧杯中的位置
    //mode==0: 显示所有该物质的位置；mode==1: 只显示物质的量为非整数的该物质的位置
    PosOfMatter(name,state,mode)
    {
        var i,j;
        var matter_test;
        var pos=[];
        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                matter_test=this.m_space[i][j].m_content;
                if(matter_test===null)
                {
                    continue;
                }
                if(matter_test.Name()===name && (matter_test.m_state===state || state==='all'))
                {
                    if(mode===0)
                    {
                        pos.push([i,j]);
                    }
                    else if(matter_test.m_number<1)
                    {
                        pos.push([i,j]);
                    }
                }
            }
        }
        return pos;
    }

    //含有某个溶质的溶剂的位置
    PosOfMatter_Solute(name)
    {
        var i;
        var newPos=[];
        var pos=[];

        for(i=0;i<this.m_solute.length;i++)
        {
            if(this.m_solute[i].m_name===name)
            {
                newPos=this.m_solute[i].m_solvent.m_pos;
                if(newPos.length!=0)
                {
                    pos.push(newPos);
                }
            }
        }

        return pos;
    }


//显示图片类的函数
    ArrayToPosition(image,i,j)
    {
        var x,y;
        x=this.m_spaceX+this.m_spaceSize*0.5-image.width*0.5+i*this.m_spaceSize;
        y=this.m_spaceY+this.m_spaceSize*0.5-image.height*0.5+j*this.m_spaceSize;
        return [x,y];
    }

    Destroy(thing)
    {
        if(thing.m_image!=null)
        {
            thing.m_image.destroy();
        }
    }

//*
    LoadImage(game,image_BK,size_section,x,y,image_Space,size_space)
    {
        var pos;
        var i=0,j=0;

        this.m_spaceSize=size_space;
        this.m_image=game.add.sprite(x,y,image_BK);
        this.m_image.scale.setTo(size_section);

        //更屏幕信息
        userScreen.Push(this);

        if(this.m_drag===true)
        {
            this.m_image.inputEnabled=true;
            this.m_image.input.enableDrag();
        }

        //放置格子
        for(i=0;i<this.m_width;i++)
        {
            for(j=0;j<this.m_height;j++)
            {
                this.m_space[i][j].m_background=game.add.sprite(0,0,image_Space);
                this.m_image.addChild(this.m_space[i][j].m_background);
                ResizeSprite(this.m_space[i][j].m_background,this.m_spaceSize,this.m_spaceSize);
                pos=this.ArrayToPosition(this.m_space[i][j].m_background,i,j);
                this.m_space[i][j].m_background.position.setTo(pos[0],pos[1]);
                this.m_image.events.onDragStart.add(this.OnDragStart,this);         //显然后面的这个this是错的。。暂时不管
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
        map.PutInto(thing);
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

    //0--没放成功，1--放进去了
    PutInto(thing,x,y)
    {
        if(this.m_type===1)
        {
            if(thing.m_state==='energy')
            {
                return this.Input_Energy(thing);
            }
            else if(thing.m_state==='object')
            {
                return 0;
            }
            else
            {
                return this.PutInto_Thing(thing,x,y);
            }
        }
        return 0;
    }
    PutInto_Thing(thing,x,y)
    {
        var p=this.CheckSpace(thing);
        var result=0;
        if(p[0]!=null)                      //如果物质原本就在烧杯中，那么把物质取出来再放回去
        {
            this.m_space[p[0]][p[1]].m_content=null;
            thing.m_pos=[];
        }
        p=this.PositionToArray(x,y);
        result=this.Input_Beaker(thing,p[0],p[1]);
        this.RenewImage();
        return result;
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
        var thing=this.m_space[pi][pj].m_content;
        if(thing==null)
        {
            return false;
        }
        if(thing.m_image===null)
        {
            thing.LoadImage_Auto();
        }
        if(this.m_image.children.indexOf(thing.m_image)===-1)
        {
            this.m_image.addChild(thing.m_image);
        }
        pos=this.ArrayToPosition(thing.m_image,pi,pj);
        if(pos[0]!=thing.m_image.x || pos[1]!=thing.m_image.y)
        {
            thing.m_image.position.setTo(pos[0],pos[1]);
        }
        return true;
    }

    ThrowAway(thing)
    {
        var p=this.CheckSpace(thing);
        if(p[0]!=null)
        {
            this.m_space[p[0]][p[1]].m_content=null;
            thing.m_pos=[];
        }
        //如果是烧杯的话，就要重新排列一下物品
        if(this.m_type===1)
        {
            if(this.PhysicRun())
            {
                this.RenewImage();
            }
        }
        return thing;
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

/*
var beaker=new CInnerSpace(4,5,0,0,false,'beaker',1);
beaker.Appear('H2O','liquid',2,[0,0]);
beaker.Appear('NaCl','solid',1,[0,0]);
beaker.PhysicRun();
beaker.ChemistryRun(world);
console.log(beaker.Information())

beaker.m_environment[0]='B';
beaker.ChemistryRun(world);
console.log(beaker.Information())

module.exports=CInnerSpace;
//*/