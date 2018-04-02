'use strict'

'use strict'
/*
var CMatter=require('./Matter');//*/

class CEquation
{
    constructor(words)
    {
        this.m_reactant=[];
        this.m_products=[];

        //环境条件
        this.m_environmentCon=[];
        //物质条件
        this.m_matterCon=[];
        //催化剂条件
        this.m_catalystCon=[];


        this.Analyze(words);
    }

    Analyze(words)
    {
        var condition;
        var i=0;
        var part=/[=][{]([a-z&A-Z0-9():]+)[}][=]/.exec(words)

        //那么首先要分析条件
        if(part!=null)
        {
            condition=part[1].split(/[&]/);

            for(i=0;i<condition.length;i++)
            {
                part=/([A-Za-z]+)[(]?([a-zA-Z0-9*-:]*)[)]?/.exec(condition[i]);
                if(part[1]!='C' && part[1]!='M')
                {
                    this.m_environmentCon.push(part[1]);
                }
                else if(part[1]==='C')
                {
                    this.m_catalystCon.push(part[2])
                }
                else if(part[1]==='M')
                {
                    var part1=part[2].split(':');
                    this.m_matterCon.push(new CMatter(part1[0],part1[1]));
                }
            }
        }

        var reactant_part=words.split(/[=][{]?[a-z&A-Z0-9():]*[}]?[=]/)[0];
        var products_part=words.split(/[=][{]?[a-z&A-Z0-9():]*[}]?[=]/)[1];
        var matters=reactant_part.split(/[+]/);
        var i;
        for(i=0;i<matters.length;i++)
        {
            part=/^(\d*)([A-Za-z0-9()*-]*)[\[]?([sgloei]?)[\]]?/.exec(matters[i]);
            var thing=new CMatter(part[2],part[3])
            if(part[1]!='')
            {
                thing.m_number=parseInt(part[1]);
            }
            this.m_reactant.push(thing);
        }
        matters=products_part.split(/[+]/)
        for(i=0;i<matters.length;i++)
        {
            part=/^(\d*)([A-Za-z0-9()*-]*)[\[]?([sgloei]?)[\]]?/.exec(matters[i]);
            var thing=new CMatter(part[2],part[3]);
            if(part[1]!='')
            {
                thing.m_number=parseInt(part[1]);
            }
            this.m_products.push(thing);
        }
    }

    Show(mode)
    {
        var equation_line='';
        var i;
        for(i=0;i<this.m_reactant.length;i++)
        {
            if(this.m_reactant[i].m_number!=1)
            {
                equation_line=equation_line+this.m_reactant[i].m_number;
            }
            equation_line=equation_line+this.m_reactant[i].Name()+`(${this.m_reactant[i].m_state})`;
            if(i<this.m_reactant.length-1)
            {
                equation_line=equation_line+'+';
            }
        }
        equation_line=equation_line+'=';
        if(this.m_environmentCon.length!=0)
        {
            equation_line=equation_line+'{'+this.m_environmentCon.join('&')+'}';
        }
        equation_line=equation_line+'=';
        for(i=0;i<this.m_products.length;i++)
        {
            if(this.m_products[i].m_number!=1)
            {
                equation_line=equation_line+this.m_products[i].m_number;
            }
            equation_line=equation_line+this.m_products[i].Name()+`(${this.m_products[i].m_state})`;
            if(i<this.m_products.length-1)
            {
                equation_line=equation_line+'+';
            }
        }

        if(mode===1)
        {
            equation_line+='\nMatter:';
            for(i=0;i<this.m_matterCon.length;i++)
            {
                equation_line+=this.m_matterCon[i].Name()+'('+this.m_matterCon[i].m_state+')'+' ';
            }
            equation_line+='\nCatalyst:';
            for(i=0;i<this.m_catalystCon.length;i++)
            {
                equation_line+=this.m_catalystCon[i]+' ';
            }
            equation_line+='\n';
        }
        return equation_line;
    }



    Reaction(reactants,condition)
    {
        var i,j;
        
        for(i=0;i<this.m_environmentCon.length;i++)
        {
            for(j=0;j<condition.length;j++)
            {
                if(this.m_environmentCon[i]===condition[j])
                {
                    break;
                }
            }
            if(j===condition.length)
            {
                return [reactants];
            }
        }

        //接着检查物质条件是否满足
        for(i=0;i<this.m_matterCon.length;i++)
        {
            for(j=0;j<reactants.length;j++)
            {
                if(this.m_matterCon[i].m_name===reactants[j].m_name && this.m_matterCon[i].m_state===reactants[j].m_state)
                {
                    break;
                }
            }
            if(j===reactants.length)
            {
                return [reactants];
            }
        }
        
        //Calculate the amount of reaction
        var reacted;
        var test=0;
        for(j=0;j<this.m_reactant.length;j++)
        {
            test=0;
            for(i=0;i<reactants.length;i++)
            {
                if(reactants[i].Name()===this.m_reactant[j].Name())
                {
                    test=(reactants[i].m_number-reactants[i].m_reacted)/this.m_reactant[j].m_number;
                    break;
                }
            }
            if(reacted>test || reacted===undefined)
            {
                reacted=test;
            }
            if(test==0)
            {
                return [reactants];
            }
        }
        

        //Begin reaction
        for(i=0;i<this.m_reactant.length;i++)
        {
            for(j=0;j<reactants.length;j++)
            {
                if(reactants[j].Name()===this.m_reactant[i].Name())
                {
                    reactants[j].m_reacted=this.m_reactant[i].m_number*reacted;
                }
            }
        }
        var products=[];
        //Products
        for(i=0;i<this.m_products.length;i++)
        {
            test=new CMatter(this.m_products[i].Name(),this.m_products[i].m_state);
            test.m_number=this.m_products[i].m_number*reacted;
            products.push(test);
        }

        return [reactants,products];
    }
}
/*
module.exports=CEquation;//*/