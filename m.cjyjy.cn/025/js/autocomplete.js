/*  Copyright Zachary, 1994-2008  |  www.genius.com.cn
* -----------------------------------------------------------
*
* The DHTML AutoComplete, version 1.5  "It is happening again"
*
* This script is developed by terminal team.  Visit us at www.genius.com.cn
*
* This script is distributed under the GNU Lesser General Public License.
* Read the entire license text here: http://www.genius.com.cn
*/

AutoComplete = function (ele, dataSource, trClickCallback, trdbclickCallback, inputEnterCallback) {
    if (ele == null) {
        // ������������Ԫ�أ�����ʼ��
        return;
    }

    // �ܿ��ı���
    this.inputElement = ele;
    this.inputElement.autocomplete = "off";
    // ����Դ(��һ���飬���� JSON ����
    this.dataSource = dataSource;
    // �����û�ƥ��Ķ��󼯺�
    this.matchedList = new Array();
    // ��ǰ�û�ѡ���������
    this.currentTrIndex = 0;
    // ����ѡ�л�˫��ѡ�е� JSON ����
    this.selectedItem = null;

    // ���� tr ѡ��ĳ������ʱ�Ļص�����
    this.trClickCallback = trClickCallback;
    // ˫�� tr ѡ��ĳ������ʱ�Ļص�����
    this.trdbclickCallback = trdbclickCallback;
    // �ı���س�ʱ�Ļص�����
    this.inputEnterCallback = inputEnterCallback;

    this.addEventListener("click", this.inputElement, this.preDraw, this);
    //this.addEventListener("dblclick", this.inputElement, this.preDraw, this);
    // ���ı����а��¼���ʱ�����������ƶ����
    this.addEventListener("keydown", this.inputElement, this.movetable, this);
    // �ı��仯ʱ���»���
    this.addEventListener("keyup", this.inputElement, this.preDraw, this);
    // Ϊ document ��� click ����
    //this.addEventListener("click", document, this.predispose, this);

    // ����¼�����ʱ���Ӳ���
    this.inputElement.attachment = this;
    document.attachment = this;
};

AutoComplete.prototype = {
    /**
    * �޸�����Դ
    * @ds ���������Դ
    */
    setDataSource: function (ds) {
        this.dataSource = ds;
        //������������Դ��,Ҫ��ԭʼ�������Ϣ���
        this.matchedList.length = 0;
        this.currentTrIndex = 0;
        this.selectedItem = null;
    },

    /**
    * ����/˫���ı����ı��򱻰��¼���ʱ�������¼����÷��������¼�Դ���������������� autocomplete
    */
    preDraw: function (eve) {

        // ����Դ��Ϊ null��������
        if (!this.dataSource) {
            alert("����ԴΪ�գ��޷�����ƥ������");
            return;
        }

        var event = eve || window.event;
        var eveSrc = event.srcElement || event.target;
        var inputvalue = eveSrc.value.trim();

        if (inputvalue == this.params.initTip) {
            this.inputElement.value = inputvalue = "";
        }

        var keyCode = event.keyCode;
        // ���� <ESC>�������������������س�(�س�ʱ������ص�����������ûص��������ڵĻ�)���򲻻��� AutoComplete
        if (keyCode == 13) {
            this.onEnter();
            // �����Ƿ��ṩ�ı���Ļص�������ֻҪ�س����Ͳ�����
            return;
        }
        if (keyCode == 27 || keyCode == 38 || keyCode == 39 || keyCode == 40 || keyCode == 37) {
            return;
        }


        this.draw(inputvalue, this.params.maxMatchedItemNumberAllowed);
    },

    /**
    * ���ݴ�ƥ����ַ��������� AutoComplete
    * @matchedString ��ƥ����ַ���
    * @maxMatchedItemNumber ���� AutoComplete ʱ�����Ƚ���ƥ��������ò�������ƥ�������������������������ٽ���ƥ��
    */
    draw: function (matchedString, maxMatchedItemNumberAllowed) {
        if (!matchedString || matchedString.trim().length == 0) {
            matchedString = "";
        }

        // ������շ����û�������б�
        this.matchedList.length = 0;
        // �ػ�ʱ����ԭ����ס�� selectedItem ���٣��Ա�õ��µ�����
        this.selectedItem = null;

        // �����û����������ƥ��
        this.match(matchedString, maxMatchedItemNumberAllowed);

        // AutoComplete ������ id Ϊ �����ļ��ж���� divContainerId ���ԵĲ��У������ڣ�ɾ�����Ա��ػ�
        var bodychilds = document.body.childNodes;
        for (var i = 0; i < bodychilds.length; i++) {
            if ((bodychilds[i].nodeType == 1) && bodychilds[i].id == this.params.divContainerId) {
                document.body.removeChild(bodychilds[i]);
                break;
            }
        }

        // AutoComplete ���ڵĲ�
        var div = document.createElement("div");
        div.id = this.params.divContainerId;
        div.style.width = this.params.displayZoneWidth + "px";
        // һ�����ڿ���ʾ N ����¼������ N ����¼�Ļ�������������Ч��
        if (this.matchedList.length >= this.params.itemNumberPerPage) {
            // KeyBoard.setStyle$prompt_limit(div);
            div.className = this.params.exceedMaxItemNumberPerPageClass;
        } else {
            // KeyBoard.setStyle$prompt_common(div);
            div.className = this.params.inItemNumberPerPageClass;
        }

        // �� table ������ div ��
        var table = document.createElement("table");
        table.id = this.params.tableId;
        table.identification = this.params.tableIdentification;
        table.border = 0;
        table.cellPadding = 2;
        table.cellSpacing = 0;
        table.width = "100%";
        table.className = this.params.tableClass;



        // �������β���ѡ�����е��ı�
        table.onselectstart = function () {
            return false;
        }

        table.onselect = function () {
            document.selection.empty();
        }

        var tbody = document.createElement("tbody");
        table.appendChild(tbody);

        // ������
        var titleRow = table.insertRow(0);
        titleRow.className = this.params.titleTrClass;
        for (var i = 0; i < this.params.displayMapping.length; i++) {
            var titleTd = titleRow.insertCell(i);
            titleTd.innerHTML = this.params.displayMapping[i].title;
            titleTd.align = "center";
            titleTd.title = this.params.displayMapping[i].alt;
            titleTd.width = this.params.displayMapping[i].displaypercentage;
            if (this.params.displayMapping[i].display && this.params.displayMapping[i].display == "none") {
                titleTd.style.display = "none";
            }
            titleTd.className = this.params.tdTitleClass;
        }

        for (var i = 0; i < this.matchedList.length; i++) {
            var matchedItem = this.matchedList[i];
            var tr = table.insertRow(i + 1);
            // Ϊ tr ���һ item ���ԣ������һ�������е���ϸ��Ϣ
            tr.item = matchedItem;
            tr.index = i + 1;
            tr.className = this.params.crossbeddedTrClassPrefix + i % 2;

            for (var j = 0; j < this.params.displayMapping.length; j++) {
                var contentTd = tr.insertCell(j);
                contentTd.innerHTML = this.format(eval("tr.item." + this.params.displayMapping[j].jsonattribute));
                if (this.params.displayMapping[j].display && this.params.displayMapping[j].display == "none") {
                    contentTd.style.display = "none";
                }
                contentTd.align = "center";
                contentTd.title = contentTd.innerText;
                contentTd.className = this.params.tdClass;
            }

            this.addEventListener("click", tr, this.trClick, this);
            this.addEventListener("dblclick", tr, this.trdblClick, this);
        }

        // Ϊ������ keydown �¼�
        this.addEventListener("keydown", table, this.movetable, this);

        // ��⵱ǰѡ�е� row �Ƿ����(����ػ��ˣ��ػ��� matchedList.length �п���С�� currentTrIndex)
        if (table.rows[this.currentTrIndex] == null) {
            this.currentTrIndex = 0;
        }

        div.appendChild(table);

        // ȷ�� div ��λ��
        var top = Gti.Common.getTop(this.inputElement);
        var left = Gti.Common.getLeft(this.inputElement);
        var width = this.inputElement.clientWidth;
        var height = this.inputElement.clientHeight; //Gti.common.getHeight(this.inputElement, false);
        // bottom: Ԫ�ص��·���ҳ�涥��ľ���(����Ԫ���Ϸ���ҳ��ײ�ľ���)��top: Ԫ�ص��Ϸ���ҳ�涥��ľ���
        var bottom = Gti.Common.getBottom(this.inputElement);
        // right: Ԫ���Ҳ���ҳ�����ľ���(����Ԫ�������ҳ���Ҳ�ľ���)��lefr: Ԫ�������ҳ�����ľ���
        var right = Gti.Common.getRight(this.inputElement);

        div.style.position = "absolute";
        div.style.zIndex = 10000;
        var offset_vertical = document.body.clientHeight - bottom;
        var offset_horizontal = document.body.clientWidth - left;
        // div.style.left = left + "px";

        var scrollTop = $(document).scrollTop();
        // �����߶�(AutoComplete ��ĸ߶�)Ϊ params.displayZoneHeight����ֵ�� css ��ʽ�е�ֵһ��
        if (offset_vertical < this.params.displayZoneHeight) {
            // ��ʾ�� inputElement ���Ϸ�
            div.style.top = scrollTop + bottom - height - div.clientHeight + 20 + "px";
        } else {
            // ��ʾ�� inputElement ���·�
            if ($.browser.msie) {
                div.style.top = top + height + "px";
            } else {
                div.style.top = scrollTop + top + height + "px";
            }
        }

        // �������(AutoComplete �Ŀ��)Ϊ params.displayZoneWidth
        if (offset_horizontal < this.params.displayZoneWidth) {
            div.style.left = left - (this.params.displayZoneWidth - offset_horizontal) + "px";
        } else {
            div.style.left = left + "px";
        }


        document.body.appendChild(div);
        //$("body").append(div);
        // ʹ�� iframe��ʹ AutoComplete �����ȼ������
        /*	var ifrRef = document.createElement("iframe");
        ifrRef.src = "about:blank?a=_jrjjrjjrj";
        ifrRef.frameBorder = "0";
        ifrRef.style.position = "absolute"
        ifrRef.style.zIndex = -1;
        ifrRef.style.scrolling = "no";
        // div.style.width/height/top/left ��������� "px" ��׺��div �����뵽 document �������� offsetWidth �� offsetHeight��֮ǰ���ǵ�ֵΪ 0
        ifrRef.style.width = div.offsetWidth;
        ifrRef.style.height = div.offsetHeight;
        ifrRef.style.top = "0px";
        ifrRef.style.left = "0px";
        ifrRef.style.display = "none";
        ifrRef.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
        div.appendChild(ifrRef);
        */
    },

    /**
    * ���������ʺ��û����룬��ʽ�������ʣ�ʹ���������г��ֹ��û�����Ĵʸ�����ʾ
    * eg: ������Ϊ "�Ұ��ҵ����"���û����� "����"����󷵻ص��� <span class="unmatched">��</span><span class="matched">����</span><span class="unmatched">�����</span>
    * ��ͨ����ʽ������θ�����ʾ�û�������
    * @wholeWord ������
    */
    format: function (wholeWord) {
        // �û�����(��Ҫ��ƥ����ַ���)
        var userInput = this.inputElement.value;
        var index = wholeWord.toUpperCase().indexOf(userInput.toUpperCase());
        if (index == -1) {
            return wholeWord;
        }

        var span = document.createElement("span");

        // ����ƥ��ǰ���ַ����㼰��������ʽ
        var beforeMatchedSpan = document.createElement("span");
        beforeMatchedSpan.className = "unmatched";

        // ����ƥ����ַ����㼰��������ʽ
        var matchedspan = document.createElement("span");
        matchedspan.className = "matched";

        // ����ƥ�����ַ����㼰��������ʽ
        var afterMatchedSpan = document.createElement("span");
        afterMatchedSpan.className = "unmatched";

        // ��ƥ��֮ǰ���ַ���(����)
        beforeMatchedSpan.innerHTML = wholeWord.substring(0, index);
        // ƥ����ַ���(����)
        matchedspan.innerHTML = userInput;
        // ƥ�����ַ���(����)
        afterMatchedSpan.innerHTML = wholeWord.substring(index + userInput.length);

        span.appendChild(beforeMatchedSpan);
        span.appendChild(matchedspan);
        span.appendChild(afterMatchedSpan);

        return span.innerHTML;
    },

    /**
    * �ڱ������ϵ��������лص�����������ûص�����
    */
    trClick: function (eve) {

        /*
        var trEvent = eve || window.event;
        var trSrc = trEvent.target || trEvent.srcElement;
		
        while (trSrc.nodeName.toUpperCase() != "TR") {
        trSrc = trSrc.parentNode;
        }
		
        // �û�ѡ��ĳ��ʱ(onclick)������ǰ�е�����(index) ���浽��������(KeyBoard.currentTrIndex)
        this.currentTrIndex = trSrc.index;
        this.changeTRClass(trSrc);
		
        // ��������ĳ��ʱ��ʹ�ı���۽�����ʱ���������Ҽ��������·���
        // ����û�и��ı������� focus �¼������ʹ�ı���۽�ʱ��������ػ�
        this.inputElement.focus();
		
        // Ϊ�ı���ֵ
        this.evaluate(trSrc);
        // Ϊѡ�е����ݶ���ֵ
        this.selectedItem = trSrc.item;
        if (this.trClickCallback) {
        this.trClickCallback(trSrc.item);	
        }
		
        */

        var trEvent = eve || window.event;
        var trSrc = trEvent.target || trEvent.srcElement;

        while (trSrc.nodeName.toUpperCase() != "TR") {
            trSrc = trSrc.parentNode;
        }

        this.evaluate(trSrc);
        // Ϊѡ�е����ݶ���ֵ
        this.selectedItem = trSrc.item;
        this.dispose();

        if (this.trClickCallback) {
            this.trClickCallback(trSrc.item);
        }
    },

    /**
    * �ڱ������˫�������лص�����������ûص�����
    */
    trdblClick: function (eve) {
        var trEvent = eve || window.event;
        var trSrc = trEvent.target || trEvent.srcElement;

        while (trSrc.nodeName.toUpperCase() != "TR") {
            trSrc = trSrc.parentNode;
        }

        this.evaluate(trSrc);
        // Ϊѡ�е����ݶ���ֵ
        this.selectedItem = trSrc.item;
        this.dispose();

        // ���û��ṩ�˻ص�������������û��ĺ���
        if (this.trdbclickCallback) {
            this.trdbclickCallback(trSrc.item);
        }
    },

    /**
    * �� �������� ���ƶ�ʱ����̬�޸� tr ����ʽ
    */
    movetable: function (eve) {
        var event = eve || window.event;
        var eveSrc = event.srcElement || this;
        var keyCode = event.keyCode;

        // <ESC>
        if (keyCode == 27) {
            // ���� div
            this.dispose();
            return;
        }

        var table = document.getElementById(this.params.tableId);
        var rows = null;
        if (table != null) {
            rows = table.rows;
        }

        // ������
        if (keyCode == 37 || keyCode == 38) {
            if (rows != null) {
                this.currentTrIndex--;
                if (this.currentTrIndex <= 0) {
                    this.currentTrIndex = this.matchedList.length;
                }

                if (rows[this.currentTrIndex] != null) {
                    this.selectedItem = rows[this.currentTrIndex].item;
                    this.evaluate(rows[this.currentTrIndex]);
                    this.changeTRClass(rows[this.currentTrIndex]);
                }

                document.getElementById(this.params.divContainerId).scrollTop = Math.floor(this.currentTrIndex / this.params.itemNumberPerPage) * this.params.displayZoneHeight;
            }
            return;
        }

        // ������
        if (keyCode == 39 || keyCode == 40) {
            if (rows != null) {
                this.currentTrIndex++;
                if (this.currentTrIndex > this.matchedList.length) {
                    this.currentTrIndex = 1;
                }
                if (rows[this.currentTrIndex] != null) {
                    this.selectedItem = rows[this.currentTrIndex].item;
                    this.evaluate(rows[this.currentTrIndex]);
                    this.changeTRClass(rows[this.currentTrIndex]);
                }

                document.getElementById(this.params.divContainerId).scrollTop = Math.floor(this.currentTrIndex / this.params.itemNumberPerPage) * this.params.displayZoneHeight;
            }
            return;
        }

        // �س�ȷ��
        if (keyCode == 13) {
            //this.onEnter();
        }
    },

    /**
    * ���ı����лس�ʱ��Ҫ��δ��ȫ���ı��򸳣������ûس��Ļص�����
    */
    onEnter: function () {
        var obj = this.getSelectedItem(this);
        if (obj) {
            // �ı���۽�
            this.inputElement.focus();
            this.inputElement.value = eval("obj." + this.params.textField);
            // ���� div
            this.dispose();
        } else {
            // ������δƥ�䵽���ַ����س��󣬸��������ļ�������Ӧ����
            if (this.params.ignoreUnExactMatchOnCheck) {
                // �����û��Ĵ��������δ��ȷƥ�䣬��ʱϵͳ����������һ��Ĭ��ֵ��������Դ�ĵ�һ������
                this.selectedItem = this.dataSource[0];
                if (this.matchedList.length == 0) {
                    this.inputElement.value = eval("this.dataSource[0]." + this.params.textField);
                } else {
                    this.inputElement.value = eval("this.matchedList[0]." + this.params.textField);
                }
                // ���� div
                this.dispose();
            } else {
                // �������û��������(���뾫ȷƥ��)���ַ�����ʱ�������ɻص������������ inputEnterCallback �����ṩ
                if (this.inputEnterCallback) {
                    this.inputEnterCallback(null);
                } else {
                    alert("�����ļ��е� ignoreUnExactMatchOnCheck Ϊ false�������û�������뾫ȷƥ�䡣���������û������δ�ܾ�ȷ����(ƥ�������ƥ�����һ��)��������û���ṩ�س�ʱ�Ļص�������");
                }
                return;
            }
        }

        if (this.inputEnterCallback) {
            this.inputEnterCallback(this.selectedItem);
        }
    },

    /**
    * ��Ե�� document ������ AutoComplete��document ������Ԫ�ر�������ᴥ�����¼�
    * nodeName == "undefined":	Firefox
    * nodeName ==  "body"			IE
    */
    predispose: function (eve) {
        var event = eve || window.event;
        var eveSrc = event.target || event.srcElement;

        if (eveSrc && (eveSrc.nodeName.toUpperCase() == "TD" || eveSrc.nodeName.toUpperCase() == "SPAN")) {
            while (true) {
                eveSrc = eveSrc.parentNode;
                if (!eveSrc) {
                    return;
                }
                if (eveSrc.nodeName.toUpperCase() == "TABLE") {
                    break;
                }
            }
        }

        if (eveSrc != this.inputElement && eveSrc.identification != this.params.tableIdentification) {
            this.dispose();
        }
    },

    /**
    * ���� AutoComplete
    */
    dispose: function () {
        // AutoComplete ������ id Ϊ�����ļ���ָ������Ϊ divContainerId �Ĳ��У������ڣ�ɾ�����Ա��ػ�
        var divcontainer = document.getElementById(this.params.divContainerId);
        if (divcontainer) {
            document.body.removeChild(divcontainer);
        }

        if (this.inputElement.value.trim() == "") {
            this.inputElement.value = this.params.initTip;
        }
    },

    /**
    * Ϊ input ��ֵ
    */
    evaluate: function (trSrc) {
        this.inputElement.value = eval("trSrc.item." + this.params.textField);
        this.inputElement.focus();
    },

    /**
    * ������Դ�ṩ��ֵ��ƥ���ƥ����ַ�������ƥ��� item ���� matchedList ��
    * @inputvalue ��ƥ����ַ���
    * @maxMatchedItemNumberAllowed ��ƥ�䵽 maxMatchedItemNumberAllowed �󣬲��ټ���ƥ�䣬��ֵС�� 0��ƥ��ȫ����
    */
    match: function (matchedString, maxMatchedItemNumberAllowed) {
        if (!maxMatchedItemNumberAllowed) {
            maxMatchedItemNumberAllowed = -1;
        }

        // �ı�������Ϊ ""����ֱ�Ӵ�����Դ copy maxMatchedItemNumberAllowed �����ݵ� matchedList �У�����Ҫƥ��
        if (matchedString == "") {
            for (var i = 0; i < this.params.maxMatchedItemNumberAllowed; i++) {
                if (i < this.dataSource.length) {
                    this.matchedList[i] = this.dataSource[i];
                } else {
                    break;
                }
            }
            return;
        }

        for (var i = 0; i < this.dataSource.length; i++) {
            for (var j = 0; j < this.params.matchFields.length; j++) {
                if (this.dataSource[i][this.params.matchFields[j]].toUpperCase().indexOf(matchedString.toUpperCase(), 0) != -1) {
                    this.append(this.dataSource[i]);
                    continue;
                }
            }

            if (maxMatchedItemNumberAllowed < 0) {
                continue;
            } else {
                if (this.matchedList.length >= maxMatchedItemNumberAllowed) {
                    break;
                }
            }
        }
    },

    /**
    * ׷��ƥ��Ĺ�Ʊ
    */
    append: function (item) {
        var isExists = function (thisobj) {
            var existence = false;
            var primarykey = thisobj.params.primarykey;
            var primaryvalue = eval("item." + primarykey);
            for (var i = 0; i < thisobj.matchedList.length; i++) {
                if (eval("thisobj.matchedList[i]." + primarykey) == primaryvalue) {
                    existence = true;
                    break;
                }
            }
            return existence;
        };

        if (!isExists(this)) {
            this.matchedList[this.matchedList.length++] = item;
        }
    },

    /**
    * ��ȡ�û�ѡ�е� item(����Դ��ĳ��)�����ȼ�� matchedList����μ������Դ����δ�ҵ�ʱ������ null
    */
    getSelectedItem: function (thisobj) {
        var iterate = function (textvalue) {
            // �����ǰ����ֻҪһ��ƥ��������û��Ƿ�������������������Ψһ��ƥ����
            if (thisobj.matchedList.length == 1) {
                return thisobj.matchedList[0];
            }

            // ��ֹһ��ƥ�����û��ƥ����ʱ�����ȱ������㵱ǰ���ڵĵļ���
            for (var i = 0; i < thisobj.matchedList.length; i++) {
                for (var j = 0; j < thisobj.params.matchFields.length; j++) {
                    var wholeWord = eval("thisobj.matchedList[i]." + thisobj.params.matchFields[j]);
                    if (thisobj.params.ignoreUnExactMatchOnCheck) {
                        // ���ؾ�ȷƥ�䣬���ʹ�� indexOf
                        if (wholeWord.toUpperCase().indexOf(textvalue.toUpperCase()) >= 0) {
                            return thisobj.matchedList[i];
                        }
                    } else {
                        // ʹ�þ�ȷƥ�䣬��ʹ�� "=="
                        if (wholeWord.toUpperCase() == textvalue.toUpperCase()) {
                            return thisobj.matchedList[i];
                        }
                    }
                }
            }

            // ��ǰ����δ�ҵ�������ȫ��
            for (var i = 0; i < thisobj.dataSource.length; i++) {
                for (var j = 0; j < thisobj.params.matchFields.length; j++) {
                    var wholeWord = eval("thisobj.dataSource[i]." + thisobj.params.matchFields[j]);
                    if (thisobj.params.ignoreUnExactMatchOnCheck) {
                        // ���ؾ�ȷƥ�䣬���ʹ�� indexOf
                        if (wholeWord.toUpperCase().indexOf(textvalue.toUpperCase()) >= 0) {
                            return thisobj.dataSource[i];
                        }
                    } else {
                        // ʹ�þ�ȷƥ�䣬��ʹ�� "=="
                        if (wholeWord.toUpperCase() == textvalue.toUpperCase()) {
                            return thisobj.dataSource[i];
                        }
                    }
                }
            }

            // ��δ�ҵ������� null
            return null;
        }; //-------------------------------------------------------------------------------------------

        var textvalue = thisobj.inputElement.value;
        if (textvalue.trim().length == 0) {
            return null;
        }

        // ����Դ��Ϊ null��ֱ�ӷ��� null
        if (!this.dataSource) {
            return null;
        }

        if (thisobj.selectedItem) {
            return thisobj.selectedItem;
        } else {
            thisobj.selectedItem = iterate(textvalue);
            return thisobj.selectedItem;
        }
    },

    /**
    * �������Ҽ��ƶ�ʱ���������ĳ�е���ʱ���޸���ʽ��ʹ�ñ�ѡ�е��е���ʽ������������
    */
    changeTRClass: function (selectedTR) {
        var table = document.getElementById(this.params.tableId);
        if (table != null) {
            var trs = table.childNodes[0].getElementsByTagName("tr");
            for (var i = 0; i < trs.length; i++) {
                if (trs[i].item == selectedTR.item) {
                    trs[i].className = this.params.trSelectedClass;
                } else {
                    trs[i].className = this.params.crossbeddedTrClassPrefix + (i + 1) % 2;
                }
            }
        }
    },

    /**
    * @eventType	�¼����ͣ����磺"click"
    * @eventSrc	�¼�Դ
    * @eventHandler	�¼�������
    * @attachment		������Ϣ
    */
    addEventListener: function (eventType, eventSrc, eventHandler, attachment) {
        var handler = eventHandler;

        if (attachment) {
            handler = function (eve) {
                eventHandler.call(attachment, eve);
            };
        }
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            eventSrc.attachEvent("on" + eventType, handler);
        } else {  //if(isFirefox=navigator.userAgent.indexOf("Firefox") > 0) {
            eventSrc.addEventListener(eventType, handler, false);
        }
    },

    /**
    * �Ѵ��� overDiv ��Χ�ڵ� elmID Ԫ�ص� visibility ����Ϊ hidden��ʹ֮���ɼ�
    * @elmID Ҫ������Ϊ���ɼ��� html Ԫ�ر�ǩ������ "select"
    * @overDiv ֻ�д��ڸ�����ָ����Ԫ�ط�Χ�ڵ� elmID �Żᱻ���أ��� document.getElementById("divId");
    */
    hideElement: function (elmID, overDiv) {
        if (Gti.Common.browser.getBrowser() == Gti.Common.browser.IE6 ||
      			Gti.Common.browser.getBrowser() == Gti.Common.browser.IE7) {
            for (i = 0; i < document.all.tags(elmID).length; i++) {
                obj = document.all.tags(elmID)[i];
                if (!obj || !obj.offsetParent) {
                    continue;
                }

                // Find the element's offsetTop and offsetLeft relative to the BODY tag.
                objLeft = obj.offsetLeft;
                objTop = obj.offsetTop;
                objParent = obj.offsetParent;

                while (objParent.tagName.toUpperCase() != "BODY" && objParent.tagName.toUpperCase() != "HTML") {
                    objLeft += objParent.offsetLeft;
                    objTop += objParent.offsetTop;
                    objParent = objParent.offsetParent;
                }

                objHeight = obj.offsetHeight;
                objWidth = obj.offsetWidth;

                if ((overDiv.offsetLeft + overDiv.offsetWidth) <= objLeft);
                else if ((overDiv.offsetTop + overDiv.offsetHeight) <= objTop);
                else if (overDiv.offsetTop >= (objTop + objHeight));
                else if (overDiv.offsetLeft >= (objLeft + objWidth));
                else {
                    obj.style.visibility = "hidden";
                }
            }
        }
    },

    /*
    * unhides <select> and <applet> objects (for IE only), use tagname, ex: "select"
    */
    showElement: function (elmID) {
        if (Gti.Common.browser.getBrowser() == Gti.Common.browser.IE6 ||
      			Gti.Common.browser.getBrowser() == Gti.Common.browser.IE7) {
            for (i = 0; i < document.all.tags(elmID).length; i++) {
                obj = document.all.tags(elmID)[i];

                if (!obj || !obj.offsetParent) {
                    continue;
                }

                obj.style.visibility = "";
            }
        }
    }
};

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

function isIE() { //ie?
    if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 1)
        return true;
    else
        return false;
}

if (!isIE()) { //firefox innerText define
    HTMLElement.prototype.__defineGetter__("innerText",
function () {
    var anyString = "";
    var childS = this.childNodes;
    for (var i = 0; i < childS.length; i++) {
        if (childS[i].nodeType == 1)
            anyString += childS[i].tagName == "BR" ? "\n" : childS[i].textContent;
        else if (childS[i].nodeType == 3)
            anyString += childS[i].nodeValue;
    }
    return anyString;
}
);
    HTMLElement.prototype.__defineSetter__("innerText",
function (sText) {
    this.textContent = sText;
}
);
}