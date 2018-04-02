'use strict'
/*
var CEquation=require('./Equation.js');
var CMatter=require('./Matter');
//*/

class CNetP
{
    constructor(type,symbol)
    {
        this.m_type=type;                      //1-字符串，2-物质，3-化学式
        this.m_symbol=symbol;

        this.m_state=false;
        this.m_map=null;

        //与其它网点的关联
        this.m_reEnd=[];
        this.m_proEnd=[];
        this.m_conEnd=[];
        this.m_cataEnd=[];

        this.m_link=[];
    }

    Connect(point,end)
    {
        var i;
        var linkEnd;
        if(end===1)
        {
            linkEnd=this.m_reEnd;
        }
        else if(end===2)
        {
            linkEnd=this.m_proEnd;
        }
        else if(end===3)
        {
            linkEnd=this.m_conEnd;
        }
        else
        {
            linkEnd=this.m_cataEnd;
        }

        for(i=0;i<linkEnd.length;i++)
        {
            if(linkEnd[i]===point)
            {
                return false;
            }
        }

        linkEnd.push(point);
        point.m_link.push(this);
        return true;
    }

    Match(map)
    {
        if(this.m_type===1)
        {
            if(map===null || map===undefined)
            {
                return false;
            }
            return this.m_symbol===map;
        }
        else if(this.m_type===2)
        {
            if(map===null || map===undefined)
            {
                return false;
            }
            return (this.m_symbol.m_name===map.m_name) && (this.m_symbol.m_state===map.m_state);
        }
        return false;
    }

    Information()
    {
        var info='';
        var i=0;

        if(this.m_type===3)
        {
            info=this.m_symbol.Show()+'\n';
            for(i=0;i<this.m_reEnd.length;i++)
            {
                if(i===0)
                {
                    info+='Reactants: ';
                }
                info+=this.m_reEnd[i].m_symbol.m_name+' ';
            }
            info+='\n';
    
            for(i=0;i<this.m_proEnd.length;i++)
            {
                if(i===0)
                {
                    info+='Products: ';
                }
                info+=this.m_proEnd[i].m_symbol.m_name+' ';
            }
            info+='\n';
    
            for(i=0;i<this.m_conEnd.length;i++)
            {
                if(i===0)
                {
                    info+='Conditions: ';
                }
                if(this.m_conEnd[i].m_type===1)
                {
                    info+=this.m_conEnd[i].m_symbol+' ';
                }
                else
                {
                    info+=this.m_conEnd[i].m_symbol.m_name+' ';
                }
            }
            info+='\n';
        }
        else
        {
            if(this.m_type===2)
            {
                info=this.m_symbol.m_name+': ';
            }
            else
            {
                info+=this.m_symbol+': ';
            }
            for(i=0;i<this.m_link.length;i++)
            {
                info+=this.m_link[i].m_symbol.Show();
                if(i<this.m_link.length-1)
                {
                    info+=', ';
                }
                else
                {
                    info+='\n';
                }
            }
        }

        return info;
    }

    Map(map)
    {
        if(this.Match(map))
        {
            this.m_map=map;
            return true;
        }
        return false;
    }

    State()
    {
        return this.Match(this.m_map);
    }

    Clear()
    {
        this.m_map=null;
    }
}

class CNet
{
    constructor(equations)
    {
        this.m_pointsT=[];
        this.m_pointsM=[];
        this.m_linksE=[];

        this.m_readyPool=[];
        this.m_infoPool=[];
        this.Weave(equations);
    }

    Weave(equations)
    {
        var i,j;
        var link;
        var matter;
        var condition;

        for(i=0;i<equations.length;i++)
        {
            link=new CNetP(3,equations[i]);
            for(j=0;j<equations[i].m_reactant.length;j++)
            {
                matter=this.GetM(equations[i].m_reactant[j]);               //如果没有找到就新建一个
                link.Connect(matter,1);
            }
            for(j=0;j<equations[i].m_products.length;j++)
            {
                matter=this.GetM(equations[i].m_products[j]);
                link.Connect(matter,2);
            }
            for(j=0;j<equations[i].m_matterCon.length;j++)
            {
                matter=this.GetM(equations[i].m_matterCon[j]);
                link.Connect(matter,3);
            }
            for(j=0;j<equations[i].m_catalystCon.length;j++)
            {
                matter=this.GetM(equations[i].m_catalystCon[j]);
                link.Connect(matter,4);
            }

            for(j=0;j<equations[i].m_environmentCon.length;j++)
            {
                condition=this.GetT(equations[i].m_environmentCon[j]);
                link.Connect(condition,3);
            }

            this.m_linksE.push(link);
        }
    }

    GetM(matter,mode)
    {
        var i;
        var pointM;
        var newP;

        for(i=0;i<this.m_pointsM.length;i++)
        {
            pointM=this.m_pointsM[i];
            if(pointM.Match(matter))
            {
                return this.m_pointsM[i];
            }
        }

        if(mode===1)
        {
            return null;
        }
        else
        {
            newP=new CNetP(2,matter);
            this.m_pointsM.push(newP);
            return newP;
        }
    }

    GetT(condition,mode)
    {
        var i;
        var pointT;
        var newP;

        for(i=0;i<this.m_pointsT.length;i++)
        {
            pointT=this.m_pointsT[i];
            if(pointT.Match(condition))
            {
                return this.m_pointsT[i];
            }
        }

        if(mode===1)
        {
            return -1;
        }
        else
        {
            newP=new CNetP(1,condition);
            this.m_pointsT.push(newP);
            return newP;
        }
    }

    Information(mode)
    {
        var i=0;
        var info='';

        if(mode===1)
        {
            info+='MATTERS:\n';
            for(i=0;i<this.m_pointsM.length;i++)
            {
                info+=this.m_pointsM[i].Information();
            }
        }
        else if(mode===2)
        {
            info+='ENVIRONMENTS:\n';
            for(i=0;i<this.m_pointsT.length;i++)
            {
                info+=this.m_pointsT[i].Information();
            }
        }
        else if(mode===3)
        {
            info+='EQUATIONS:\n';
            for(i=0;i<this.m_linksE.length;i++)
            {
                info+=this.m_linksE[i].Information()+'\n';
            }
        }
        else if(mode===4)
        {
            info+='READY!:\n';
            for(i=0;i<this.m_readyPool.length;i++)
            {
                info+=this.m_readyPool[i].Information()+'\n';
            }
        }

        return info;
    }

    InformationOfMatter(name,state)
    {
        var i=0;
        var info='';
        if(state==='energy')
        {
            for(i=0;i<this.m_pointsT.length;i++)
            {
                if(name===this.m_pointsT[i].m_symbol)
                {
                    info+=this.m_pointsT[i].Information();
                    break;
                }
            }
        }
        else
        {
            for(i=0;i<this.m_pointsM.length;i++)
            {
                if(name===this.m_pointsM[i].m_symbol.m_name && state===this.m_pointsM[i].m_symbol.m_state)
                {
                    info+=this.m_pointsM[i].Information();
                    break;
                }
            }
        }
        return info;
    }

    Filter(matters,conditions)
    {
        var i,j;
        var ready=true;
        var testE;

        this.ClearAll();
        //设置筛选条件
        for(i=0;i<matters.length;i++)
        {
            for(j=0;j<this.m_pointsM.length;j++)
            {
                if(this.m_pointsM[j].Map(matters[i]))
                {
                    break;
                }
            }
        }
        for(i=0;i<conditions.length;i++)
        {
            for(j=0;j<this.m_pointsT.length;j++)
            {
                if(this.m_pointsT[j].Map(conditions[i]))
                {
                    break;
                }
            }
        }
        //选取满足筛选条件的方程式放入readyPool
        for(i=0;i<this.m_linksE.length;i++)
        {
            testE=this.m_linksE[i];
            for(j=0;j<testE.m_reEnd.length;j++)
            {
                if(testE.m_reEnd[j].State()===false)
                {
                    ready=false;
                    break;
                }
            }
            if(ready===false)
            {
                ready=true;
                continue;
            }
            //继续判断反应条件是否满足
            for(j=0;j<testE.m_conEnd.length;j++)
            {
                if(testE.m_conEnd[j].State()===false)
                {
                    ready=false;
                    break;
                }
            }
            if(ready===true)
            {
                this.m_readyPool.push(testE);
            }
            else
            {
                ready=true;
            }
        }
    }

    ClearAll()
    {
        var i;
        this.m_readyPool=[];

        for(i=0;i<this.m_pointsM.length;i++)
        {
            this.m_pointsM[i].Clear();
        }
        for(i=0;i<this.m_pointsT.length;i++)
        {
            this.m_pointsT[i].Clear();
        }
    }

    //将确认池中的方程式以可以使用的形式输出出来吧
    OutputEquations()
    {
        var i,j;
        var matters=[];
        var conditions=[];
        var equation;
        var laws=[];
        var link;

        for(i=0;i<this.m_readyPool.length;i++)
        {
            matters=[];
            conditions=[];
            link=this.m_readyPool[i];
            equation=link.m_symbol;
            //收集反应物
            for(j=0;j<link.m_reEnd.length;j++)
            {
                matters.push(link.m_reEnd[j].m_map);
            }
            //收集反应条件，并区分什么是条件什么是物质
            for(j=0;j<link.m_conEnd.length;j++)
            {
                if(link.m_conEnd[j].m_type===2)
                {
                    matters.push(link.m_conEnd[j].m_map);
                }
                else if(link.m_conEnd[j].m_type===1)
                {
                    conditions.push(link.m_conEnd[j].m_map);
                }
            }
            laws.push([equation,matters,conditions]);
        }
        return laws;
    }
}

class CChemLaws
{
    constructor(lawsBook)
    {
        this.m_knowledge=null;
        this.ReadBook(lawsBook);
    }

    ReadBook(book)
    {
        var i;
        var terms=book.split(/\n+/);
        var laws=[];

        for(i=0;i<terms.length;i++)
        {
            console.log(terms[i]);
            laws.push(new CEquation(terms[i]));
        }
        this.m_knowledge=new CNet(laws);
    }

    Reaction(matters,conditions)
    {
        var i=0;
        var products=[];
        var p=[];
        var laws;

        //筛选出符合要求的反应式
        this.m_knowledge.Filter(matters,conditions);
        laws=this.m_knowledge.OutputEquations();

        for(i=0;i<laws.length;i++)
        {
            p=laws[i][0].Reaction(laws[i][1],laws[i][2]);
            if(p[1]!=undefined)
            {
                products=products.concat(p[1]);
            }
        }

        return [matters,products];
    }
}


/*
var book=`2H2[g]+O2[g]={f}=2H2O[l]
H2[g]+O2[g]={f}=H2O2[l]
2Na[s]+2H2O[l]==2NaOH[s]+H2[g]
NaOH[s]={M(H2O:l)}=Na*[o]+OH-[o]
NaCl[s]={M(H2O:l)}=Na*[o]+Cl-[o]
2Cl-[o]+2H2O[l]+2Na*[o]={B}=2NaOH[s]+H2[g]+Cl2[g]`;


var world=new CChemLaws(book);
var A=new CMatter('H2O','l');
var B=new CMatter('H2','g');
var C=new CMatter('Na','s');
var D=new CMatter('NaOH','s');
var E=new CMatter('O2','g');
world.m_knowledge.OutputEquations();
console.log(world.m_knowledge.Information(4));
console.log(world.Reaction([A,B,C,D],['f']));

module.exports=world;
//*/