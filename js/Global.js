'use strict'

var userScreen;
var world;




function ResizeSprite(image,width,height,mode)
{
    width=Math.abs(width);
    height=Math.abs(height);

    if(width===0 || height===0)
    {
        return;
    }

    if(mode===1)
    {
        image.width=width;
        image.height=height;
        return;
    }

    var tmpW=image.width*height/image.height;
    var tmpH=image.height*width/image.width;
    if(tmpW<width)
    {
        image.width=tmpW;
        image.height=height;
    }
    else
    {
        image.width=width;
        image.height=tmpH;
    }
}
