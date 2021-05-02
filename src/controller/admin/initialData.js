const Category=require("../../models/category");
const Product=require("../../models/product");
const Order = require("../../models/order");

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
  for(let cate of category ){
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
exports.initialData=async function(req,res){
  const categories=await Category.find({}).exec();
  const products=await Product
  .find({})
  .select('_id name price quantity slug description productPicture category')
  .populate({path:"category",select:"_id name"})
  .exec();
  const orders = await Order.find({})
    .populate("items.productId", "name")
    .exec();
 res.status(200).json({
   categories:createCategories(categories),
   products,
   orders
 });

}
