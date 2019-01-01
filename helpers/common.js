const constant = require("../constants");
const config = require("../config");
const fs = require("fs");
const async = require("async");
const jwt = require('jsonwebtoken');
const common_helper = {};

/**
 * sign will get encode your plain Object into cipherText
 * @param {*} plainObject plain Object
 * @return {*} new generated cipher text
 */
common_helper.sign = async (plainObject) => {
  try {
    var data = await jwt.sign(plainObject, config.SECRET_KEY, { expiresIn: config.TOKEN_EXPIRED_TIME })
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * count will get count number of document in collection
 * @param {Collection Object} model name of collection
 * @param {Object} condition condition of fetch record
 * @return {Object} responseObject with status,message and data(no. of record count)
 */
common_helper.count = async (model, condition = {}) => {
  try {
    let data = await model.countDocuments(condition);
    return { status: 1, message: "Data found", data };
  } catch (error) {
    return { status: 0, message: "No data found" };
  }
};

/**
 * insert new record in collection
 * @param {Collection Object} model name of collection
 * @param {Object} newData object of new record 
 * @return {Object} responseObject with status,message and data(new inserted record object)
 */
common_helper.insert = async (Model, newData) => {
  try {
    let document = new Model(newData);
    let data = await document.save();
    return { status: 1, message: "Data inserted", data };
  } catch (error) {
    return { status: 0, message: "No data inserted" };
  }
};

/**
 * insert Many records in collection
 * @param {Collection Object} model name of collection
 * @param {Array} newData array of new records objects 
 * @return {Object} responseObject with status,message and data(new inserted records count)
 */
common_helper.insertMany = async (Model, newData) => {
  try {
    let data = await Model.insertMany(newData);
    return { status: 1, message: "Data inserted", data };
  } catch (error) {
    return { status: 0, message: "No data inserted" };
  }
};

/**
 * update existing record in collection
 * @param {Collection Object} model name of collection
 * @param {Object} condition condition of which record to be update 
 * @param {Array} newData object of record to be replace with old record 
 * @return {Object} responseObject with status,message and data(updated record object)
 */
common_helper.update = async (model, condition, newData) => {
  try {
    let data = await model.findOneAndUpdate(condition, newData, { new: true });
    return { status: 1, message: "Data updated", data };
  } catch (error) {
    return { status: 0, message: "No data updated" };
  }
};

/**
 * soft delete record in collection(set flag isDeleted: 1)
 * @param {Collection Object} model name of collection
 * @param {Object} condition condition of which record to be delete 
 * @return {Object} responseObject with status,message and data(deleted record object)
 */
common_helper.softDelete = async (model, condition) => {
  try {
    let data = await model.findOneAndUpdate(condition, { isDeleted: 1 }, { new: true });
    return { status: 1, message: "Data deleted", data };
  } catch (error) {
    return { status: 0, message: "No data deleted" };
  }
};


/**
 * delete record in collection
 * @param {Collection Object} model name of collection
 * @param {Object} condition condition of which record to be delete 
 * @return {Object} responseObject with status,message and data(deleted record object)
 */
common_helper.delete = async (model, condition) => {
  try {
    let data = await model.findOneAndDelete(condition);
    return { status: 1, message: "Data deleted", data };
  } catch (error) {
    return { status: 0, message: "No data deleted" };
  }
};


/**
 * find records in collection
 * @param {Collection Object} model name of collection
 * @param {Object} condition condition of which record to be find 
 * @return {Object} responseObject with status,message and data(fetched records array)
 */
common_helper.find = async (model, condition = {}) => {
  try {
    let data = await model.find(condition).lean();
    return { status: 1, message: "Data found", data };
  } catch (error) {
    return { status: 0, message: "No data found" };
  }
};


/**
 * find one records in collection
 * @param {Collection Object} model name of collection
 * @param {Object} condition condition of which record to be find 
 * @return {Object} responseObject with status,message and data(fetched single record)
 */
common_helper.findOne = async (model, condition = {}) => {
  try {
    let data = await model.findOne(condition).lean();
    return { status: 1, message: "Data found", data };
  } catch (error) {
    return { status: 0, message: "No data found" };
  }
};


/**
 * find records in collection
 * @param {Files} files data of file or files
 * @param {String} dir path of directory where to upload data 
 * @param {String} name name of file to be generate for newly uploaded file. 
 * @return {Object} responseObject with status,message and data(array of all uploaded files path)
 */
// let samplePromise = await common_helper.upload(req.files['filename'], "folder_name", "file_pre_name");
common_helper.upload = (files, dir, name = "") => {
  var promise = new Promise(function (resolve, reject) {
    var file_path_list = [];
    try {
      if (files) {
        let _files = [].concat(files);
        async.eachSeries(_files, function (file, next) {
          if (constant.MIME_TYPES.indexOf(file.mimetype) >= 0) {
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            var filename = "";
            try {
              filename =
                file.name.split(".")[0].replace(/\s/g, "_") + new Date().getTime() + "." + file.name.split(".").pop();
            } catch (error) {
              filename = name + new Date().getTime() + "." + file.name.split(".").pop();
            }
            file.mv(dir + "/" + filename, err => {
              if (err) {
              } else {
                location = dir + "/" + filename;
                file_path_list.push(location);
                next();
              }
            });
          } else {
            next();
          }
        }, function () {
          resolve({ status: 1, message: `Image uploaded`, data: file_path_list });
        });
      } else {
        reject({ status: 0, message: "No Image selected" });
      }
    } catch (error) {
      reject({ status: 0, message: "No Image selected" });
    }
  });
  return promise;
};

module.exports = common_helper;
