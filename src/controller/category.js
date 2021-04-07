const Category=require("../models/category");
const slugify=require("slugify");

function createCategories(categories,parentId=null){
  const categoryList=[];
  var category;
  if(parentId==null){
    category=categories.filter(function(cat){
       return cat.parentId==undefined;
    });
  }
  else{
    category=categories.filter(function(cat){
       return cat.parentId==parentId;
  });
}
  for(var cate of category ){
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      children: createCategories(categories, cate._id),
    });
  }
  return categoryList;
}

exports.addCategory=function(req,res){

     const categoryObj={
       name:req.body.name,
       slug:slugify(req.body.name)

     };
     if(req.file){
       categoryObj.categoryImage=process.env.API+ `/public/`+req.file.filename;;
     }

     if(req.body.parentId)
     {
       categoryObj.parentId=req.body.parentId;
     }
     const cat=new Category(categoryObj);
     cat.save(function(err,category){
       if(err){
         return res.status(400).json({err});
       }
       if(category){
         return res.status(201).json({category});
       }
     });
}

exports.getCategories=function(req,res){
  Category.find({}).exec(function(err,categories){
    if(err){
      return res.status(400).json({err});
    }
    if(categories){
      const categoryList=createCategories(categories);
      return res.status(200).json({categoryList});
    }
  });
}
