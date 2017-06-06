/**
*  This function "patches" an input field (or other element) to use a autocomplete for complete user input automatically
*
*  The "params" is a single object that can have the following properties:
*
*    prop. name											| description
*  -------------------------------------------------------------------------------------------------
*		inputElement										| �ı�����ı���� id���Զ���ɹ��ܽ��Ը��ı�����в���
*		initTip													| �ı���ĳ�ʼ����ʾ���û���ʾ�û���Щ��Ϣ
*		toolTip													| ��������ı����Ϸ�ʱ��ʾ�û����ʹ�ø� AutoComplete ��һ���ı�
*		dataSource											| �����Զ���ɵ�����Դ����һ�����飬ÿһ��Ԫ����һ JSON ����
*		trClickCallback									| AutoComplete �� table ��ʾ����ĳһ�б����ʱ��AutoComplete �����õĴ˺���(����ṩ�Ļ�)
*		trdbclickCallback								| AutoComplete �� table ��ʾ����ĳһ�б�˫��ʱ��AutoComplete �����õĴ˺���(����ṩ�Ļ�)
*		inputEnterCallback							| �� inputElement �лس�ʱ��AutoComplete �����ô˺���(����ṩ�Ļ�)
*		divContainerId									| AutoComplete ������ id(div's id)
*		tableId													| AutoComplete �������У����� table ��ʽ���ֵģ������Դ��� table �� id
*		itemNumberPerPage								| ��ʾ AutoComplete ƥ����ʱ��һ������ʾ������(��������ͷ)
*		maxMatchedItemNumberAllowed			| ��ƥ�䵽 maxMatchedItemNumberAllowed ����ָ���ĸ����󣬲��ټ���ƥ�䣬�Լ���ͻ��� js ��ִ���ٶȡ���С�� 0����ƥ��ȫ��
*		displayZoneWidth								| AutoComplete չʾ���Ŀ�ȣ������ṩ�ò�����ϵͳ��ʹ�� inputElement �Ŀ����Ϊչʾ���Ŀ��
*		displayZoneHeight								|	AutoComplete չʾ���ĸ߶ȡ���ƥ�䵽�ĸ������� (itemNumberPerPage - 1)ʱ����Ӧ�߶ȣ����򽫹̶���ֵָ���ĸ߶ȣ��Ҹø߶���� css �ļ�ָ���ĸ߶�һ��
*		tableIdentification							| ����ҳ���κδ�����ʱ��AutoComplete �����١�����ƥ������� table �ϵ�ĳ�е���ѡ�񣬴�ʱҲ�ᴥ�� document.onclick �¼���ͬʱ��
��ҳ���н��кܶ��table��AutoComplete �� table ��������һ tableIdentification ���������¼�Դ�� table���� tableIdentification Ϊ
��������ָ����ֵʱ�������� AutoComplete
*		exceedMaxItemNumberPerPageClass | ��ƥ����ĸ������� (itemNumberPerPage - 1)ʱ��ʹ�õ���ʽ����
*		inItemNumberPerPageClass	      | ��ƥ����ĸ���δ���� (itemNumberPerPage - 1)ʱ��ʹ�õ���ʽ����
*		tableClass											| չ��ƥ����б����ʽ���� table ��ʽ����
*		crossbeddedTrClassPrefix				| �����е���ʽǰ׺���������� 0��1��2 ... �Ƚ����������еı���ɫ��ͬ
*		titleTrClass										| �����е���ʽ
*		trSelectedClass									| ÿ�������л�ѡ�е��е���ʽ
*		tdClass													| չ��ƥ����б����ʽ��table �и�����Ԫ�����ʽ
*		displayMapping									| ����Դ���� AutoComplete ������͸���ģ������Ҫ��֪ AutoComplete ��չʾ����չʾ��Ϣӳ�䣺
title							չʾ���� table �ı���
alt								�Ա������ϸ���ͣ����������� tr ��ʱ����ʾ��Ϣ
jsonattribute			���ж�Ӧ������Դ�� JSON ������
displaypercentage	������ʾҪռ�İٷֱȣ��� "%" ��β
�����ĸ�������ϳ�һ������ json ����displayMapping ����������������� json �������������Ҫչ�ֵ�������
*		matchFields											| displayMapping ֻ��Ҫչʾ���е�ӳ�䣬���ṩ�� jsonattribute ��һ����ΪҪƥ����ֶΡ����о�����Ϊ��������Դ������ json����
{'text':'�ƴ�֤ȯ', 'content':'27', 'orgCode':'200038219', 'spell':'cdzq'}
��չʾ����ʾ�Ŀ���ֻ�� text ���ԣ������û����� "cd" ʱ��AutoComplete Ӧ��ȥƥ�� "spell" ���ԣ���Ҫ��ƥ��������� matchFields ָ����
����һ�����飬������ƥ������Դ�Ķ�����ԡ�����ƥ��󣬸�����ʾ(Ŀǰ�Ժ�ɫ��ʶ)���������� displayMapping �� jsonattribute ������ȷ��
*		primarykey											| ��������Դ��Ψһ�Ե� json ������
*		textField												| AutoComplete Э���û����ʱ�����û�ѡ����������� inputElement �У�����������Դ���ĸ� json ���������ɸ�����ָ��
*		ignoreUnExactMatchOnCheck				| (true/false) ���û��س���Ҫ�����ѡ�����ʱ����ʱ��ƥ�������ƥ�����һ������޷�֪���û���Ҫ�ĸ�ֵ
true	�����û���ѡ����ȷ������Ҫ��ʾ�û���ֱ��ȡ����Դ�ĵ� 0 ������(ƥ������)��ȡƥ�䵽�ĵ� 0 ��(ƥ�䵽����)
false	�������û��ṩ׼ȷ�����룬���򣬽��� inputEnterCallback �ص�����������ʱ��δ�ṩ�ú���������ʾ����ú���
*
*		�����ἰ�����Բ�����Ҫ���ṩ�����Ƕ���Ĭ��ֵ��������ˣ������δ�ṩ "inputElement", "dataSource", "displayMapping", "matchFields", "primarykey"
*		or "textField"��AutoComplete �ĳ�ʼ��������������ɡ�
*/
AutoComplete.setup = function (params) {
    var withDefaultValue = function (paramName, defaultValue) {
        if (typeof params[paramName] == "undefined") {
            params[paramName] = defaultValue;
        }
    };

    withDefaultValue("inputElement", null);
    withDefaultValue("initTip", "");
    withDefaultValue("toolTip", "");
    withDefaultValue("dataSource", null);
    withDefaultValue("trClickCallback", null);
    withDefaultValue("trdbclickCallback", null);
    withDefaultValue("inputEnterCallback", null);
    withDefaultValue("divContainerId", "dd");
    withDefaultValue("tableId", "tt");
    withDefaultValue("itemNumberPerPage", 11);
    withDefaultValue("maxMatchedItemNumberAllowed", 10);
    withDefaultValue("displayZoneWidth", 240);
    withDefaultValue("displayZoneHeight", 210);

    withDefaultValue("tableIdentification", "hello");
    withDefaultValue("exceedMaxItemNumberPerPageClass", "prompt_limit");
    withDefaultValue("inItemNumberPerPageClass", "prompt_common");
    withDefaultValue("tableClass", "table_class");
    withDefaultValue("crossbeddedTrClassPrefix", "cross_tr_class_");
    withDefaultValue("titleTrClass", "title_tr_class");
    withDefaultValue("trSelectedClass", "tr_selected_class");
    withDefaultValue("tdClass", "td_class");
    withDefaultValue("tdTitleClass", "td_title_class");

    withDefaultValue("displayMapping", [
								{ "title": "��Ʊ����", "alt": "��Ʊ����", "jsonattribute": "c", "displaypercentage": "30%" },
								{ "title": "��Ʊ����", "alt": "��Ʊ����", "jsonattribute": "n", "displaypercentage": "40%" },
								{ "title": "��Ʊ���", "alt": "��Ʊ���", "jsonattribute": "p", "displaypercentage": "30%" }
							]);
    withDefaultValue("matchFields", ["c", "n", "p"]);
    withDefaultValue("primarykey", "c");
    withDefaultValue("textField", "c");

    withDefaultValue("ignoreUnExactMatchOnCheck", true);

    var attributes = ["inputElement", "dataSource", "trClickCallback", "trdbclickCallback", "inputEnterCallback"];
    for (var i in attributes) {
        if (typeof params[attributes[i]] == "string") {
            params[attributes[i]] = document.getElementById(params[attributes[i]]);
        }
    }
    if (!params["inputElement"]) {
        alert("���йܵ��ı��򲻴��ڣ���ʼ��ʧ�ܣ��������Ĵ��롣");
        return null;
    }
    if (!params["dataSource"]) {
        alert("����Ҫ������Դ�����ڣ���ʼ��ʧ�ܣ��������Ĵ��롣");
        return null;
    }
    if (!params["displayMapping"]) {
        alert("����Դ�ֶε�չʾ������ʾӳ��δָ����");
        return null;
    }
    if (!params["matchFields"]) {
        alert("���ڸ����û�����ƥ�������Դ�ֶμ���δָ����");
        return null;
    }
    if (!params["primarykey"]) {
        alert("����Դ������ָ��Ψһ�Ե��ֶ�δָ����");
        return null;
    }
    if (!params["textField"]) {
        alert("�û�����ı��������Դ�ֶ�δָ����");
        return null;
    }

    // displayZoneWidth ��δָ�������� inputElement �Ŀ�ȼ��㣬����ָ����ȼ���
    params.displayZoneWidth = params.displayZoneWidth ? params.displayZoneWidth : params.inputElement.clientWidth;

    var autoCompleteInstance = new AutoComplete(params.inputElement, params.dataSource, params.trClickCallback, params.trdbclickCallback, params.inputEnterCallback);
    autoCompleteInstance.inputClickCallback = params.inputClickCallback;
    if (!params["inputElement"].value) {
        params.inputElement.value = params.initTip;
    }
    params.inputElement.title = params.toolTip;
    autoCompleteInstance.params = params;
    return autoCompleteInstance;
}