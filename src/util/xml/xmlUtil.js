import { parseStringPromise } from "xml2js";

/**
 * 解析xml字符串为json对象
 * @param xmlString
 * @returns {*} promise对象
 */
export const xmlToJson = (xmlString) => {
    return  parseStringPromise(xmlString, { explicitArray: false });
}
/**
 * 判断 XML 是否包含 atuserlist，如果存在则返回对应的列表，否则返回空数组
 */
export const isAiTe = async (xmlString) => {
    return new Promise((resolve, reject) => {
        try {
            xmlToJson(xmlString).then( json => {
                // 解析后的 JSON 结构
                const atuserlist = json?.msgsource?.atuserlist || "";

                // 如果 atuserlist 存在且非空，拆分成数组（按逗号分割）
                resolve( atuserlist ? atuserlist.split(",").filter(Boolean) : []);
            })
        } catch (error) {
            console.error("XML 解析错误:", error);
            reject(error);
        }
    })
};

// // // 示例 XML
// const xmlData = `
// <msgsource>
//     <atuserlist>,wxid_c20lgiffkxkg22,wxid_0pqmg06l8qh522</atuserlist>
//     <pua>1</pua>
//     <silence>1</silence>
//     <membercount>3</membercount>
//     <signature>V1_iYQJ5Rmv|v1_iYQJ5Rmv</signature>
//     <tmp_node>
//         <publisher-id/>
//     </tmp_node>
// </msgsource>`;
//
// isAiTe(xmlData).then(res => console.log(res)).catch(err => console.error("解析错误:", err));
//
// xmlToJson(xmlData)
//     .then(json => console.log(JSON.stringify(json, null, 2)))
//     .catch(err => console.error("解析错误:", err));
