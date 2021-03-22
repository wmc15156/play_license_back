// 공연목적, 교육목적, 기타 문자열 => array로 변환
export const convertToArray = (array: any) => {
  return array.map((data) => {
    data.brokerageConsignment = data.brokerageConsignment.split(',');
    data.brokerageConsignment = data.brokerageConsignment.map((cate) => {
      return cate.replace("목적","");
    });
    return data;
  })
}


