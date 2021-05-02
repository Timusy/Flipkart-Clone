const Category=require("../models/category");
const slugify=require("slugify");
const shortid=require("shortid")

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
       type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }
  return categoryList;
}

exports.addCategory=function(req,res){

     const categoryObj={
       name:req.body.name,
       slug:`${slugify(req.body.name)}-${shortid.generate()}`

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

exports.updateCategories=async (req,res)=>{

  const {_id,name,parentId,type}=req.body;
  const updateCategories=[];
  if(name instanceof Array){
    for(let i=0;i<name.length;i++){
      const category={
        name:name[i],
        type:type[i]
      };
      if(parentId[i]!==""){
        category.parentId=parentId[i];
      }
      const updatedCategory=await Category.findOneAndUpdate({_id:_id[i]},category,{new:true});
      updateCategories.push(updatedCategory);

    }
    return res.status(201).json({updatedCategories:updateCategories});

  }
  else{
    const category={
      name,
      type
    };
    if(parentId!==""){
      category.parentId=parentId;
    }
    const updatedCategory=await Category.findOneAndUpdate({_id},category,{new:true});
    return res.status(201).json({updatedCategory});

  }
}

exports.deleteCategories = async (req, res) => {


  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({
      _id: ids[i]._id

    });
    deletedCategories.push(deleteCategory);
  }

  if (deletedCategories.length == ids.length) {
    res.status(201).json({ message: "Categories removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }


}
