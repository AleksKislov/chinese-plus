import { component$ } from "@builder.io/qwik";
import { FlexRow } from "~/components/common/layout/flex-row";
import { type DocumentHead } from "@builder.io/qwik-city";
import { MainContent } from "~/components/common/layout/main-content";
import { Sidebar } from "~/components/common/layout/sidebar";
import { PageTitle } from "~/components/common/layout/title";

export default component$(() => {
  return (
    <>
      <PageTitle txt={"Ключи китайских иероглифов"} />

      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Ключи</h2>
              <p>
                Ключи или radicals (радикалы на английском) по-китайски называют <span>部首</span>{" "}
                <strong>bùshǒu</strong>, то есть голова раздела, имеется в виду главный иероглиф
                раздела словаря.
              </p>{" "}
            </div>
          </div>
        </Sidebar>

        <MainContent>
          <div class='prose'>
            <p>
              <strong>
                Всего в китайской письменности 214 ключей (в словаре Канси от XVIII в.
                использовалось это число)
              </strong>
              , все они используются и сегодня (как в словарях с традиционными иероглифами, так и с
              упрощенными). В современном китайском языке в связи с упрощением иероглифов число
              используемых ключей тоже уменьшилось, поэтому в некоторых современных словарях можно
              увидеть и 201 ключ, и 190 ключей.
            </p>

            <p>
              <strong>Одни из ключей встречаются чаще, другие очень редко.</strong> Строки с самыми
              часто встречаемыми (в словаре) ключами обозначены{" "}
              <strong class='text-warning'>оранжевым цветом</strong>, иероглифы с этими ключами вам
              будут встречаться чаще всего. Речь про эти ключи: 艹 трава (№140), 水 вода (№85), 木
              дерево (№75), 扌рука (№64), 口 рот (№30), 心 сердце (№61), 虫 насекомое (№142), 竹
              бамбук (№118), 言 речь (№149) и 纟 нить (№120).
            </p>

            <p>
              <strong class='text-info'>Синие ключи</strong> тоже будут вам довольно часто
              встречаться в иероглифах. В целом, когда уже и зеленые, и оранжевые хорошо усвоены,
              стоит запомнить и остальные.
            </p>

            <p>
              <strong>У многих ключей есть тривиальные, используемые в речи, названия.</strong> Во
              многих из них отображено, где именно ключ находится в иероглифе, например, ключ
              &quot;человек&quot; в левой части иероглифа 亻- это 单人旁 (буквально одинокий человек
              сбоку, например, как в иероглифе 休), а вот ключ &quot;человек&quot; сверху - это
              人字头 (букв. человек-иероглиф-голова, то есть &quot;человек&quot; на голове
              иероглифа, например, как в иероглифе 会). Если ключ расположен в нижней части
              иероглифа, то часто название принимает такой вид 皿字底 (то есть ключ 皿
              &quot;сосуд&quot; снизу иероглифа, например, как в иероглифе 蓝).
            </p>

            <p>
              Не путайте понятия ключ и компонент иероглифа, который по-китайски <span>偏旁</span>{" "}
              <strong>piānpáng. </strong>Компонент <span>偏旁</span> - просто составляющая
              иероглифа, то есть это не только ключ, но и другие составные части иероглифа,
              например, фонетик и др..
            </p>
          </div>
        </MainContent>
      </FlexRow>

      <div class='overflow-x-auto'>
        <table class='table table-compact table-zebra w-full text-base-content'>
          <thead>
            <tr>
              <th>#</th>
              <th>Ключ</th>
              <th>
                Варианты
                <br />
                написания
              </th>
              <th>
                Традиционный
                <br />
                вариант
              </th>
              <th>Пиньинь</th>
              <th>
                Название
                <br />
                по-русски
              </th>
              <th>
                Кол-во
                <br />
                черт
              </th>
              <th>
                Тривиальное
                <br />
                название
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>一</td>
              <td> </td>
              <td> </td>
              <td>yi1</td>
              <td>единица</td>
              <td>1</td>
              <td>横</td>
            </tr>
            <tr>
              <td>2</td>
              <td>丨</td>
              <td> </td>
              <td> </td>
              <td>gun3</td>
              <td>вертикаль</td>
              <td>1</td>
              <td>竖</td>
            </tr>
            <tr>
              <td>3</td>
              <td>丶</td>
              <td> </td>
              <td> </td>
              <td>zhu3</td>
              <td>точка</td>
              <td>1</td>
              <td>点</td>
            </tr>
            <tr>
              <td>4</td>
              <td>丿</td>
              <td>乀, 乁</td>
              <td> </td>
              <td>pie3</td>
              <td>откидная</td>
              <td>1</td>
              <td>撇</td>
            </tr>
            <tr>
              <td>5</td>
              <td>乙</td>
              <td>乚, 乛</td>
              <td> </td>
              <td>yi3</td>
              <td>и, второй</td>
              <td>1</td>
            </tr>
            <tr>
              <td>6</td>
              <td>亅</td>
              <td> </td>
              <td> </td>
              <td>jue2</td>
              <td>крюк</td>
              <td>1</td>
            </tr>
            <tr>
              <td>7</td>
              <td>二</td>
              <td> </td>
              <td> </td>
              <td>er4</td>
              <td>два</td>
              <td>2</td>
            </tr>
            <tr>
              <td>8</td>
              <td>亠</td>
              <td> </td>
              <td> </td>
              <td>tou2</td>
              <td>крышка</td>
              <td>2</td>
              <td>点横部</td>
            </tr>
            <tr class='text-info'>
              <td>9</td>
              <td>人</td>
              <td>亻</td>
              <td> </td>
              <td>ren2</td>
              <td>человек</td>
              <td>2</td>
              <td>
                亻,单人旁
                <br />
                人, 人字头
              </td>
            </tr>
            <tr>
              <td>10</td>
              <td>儿</td>
              <td> </td>
              <td> </td>
              <td>er2</td>
              <td>ноги</td>
              <td>2</td>
            </tr>
            <tr>
              <td>11</td>
              <td>入</td>
              <td> </td>
              <td> </td>
              <td>ru4</td>
              <td>входить</td>
              <td>2</td>
            </tr>
            <tr>
              <td>12</td>
              <td>八</td>
              <td>丷</td>
              <td> </td>
              <td>ba1</td>
              <td>восемь</td>
              <td>2</td>
              <td>八字旁</td>
            </tr>
            <tr>
              <td>13</td>
              <td>冂</td>
              <td> </td>
              <td> </td>
              <td>jiong3</td>
              <td>земли далеко за городом</td>
              <td>2</td>
              <td>同字框</td>
            </tr>
            <tr>
              <td>14</td>
              <td>冖</td>
              <td> </td>
              <td> </td>
              <td>mi4</td>
              <td>покрывало</td>
              <td>2</td>
              <td>秃宝盖</td>
            </tr>
            <tr class='text-info'>
              <td>15</td>
              <td>冫</td>
              <td> </td>
              <td> </td>
              <td>bing1</td>
              <td>лед</td>
              <td>2</td>
              <td>两点水</td>
            </tr>
            <tr>
              <td>16</td>
              <td>几</td>
              <td> </td>
              <td> </td>
              <td>ji1</td>
              <td>столик</td>
              <td>2</td>
            </tr>
            <tr>
              <td>17</td>
              <td>凵</td>
              <td> </td>
              <td> </td>
              <td>qu3</td>
              <td>раскрытый рот</td>
              <td>2</td>
            </tr>
            <tr class='text-info'>
              <td>18</td>
              <td>刀</td>
              <td>刂</td>
              <td> </td>
              <td>dao1</td>
              <td>нож</td>
              <td>2</td>
              <td>刂, 立刀旁</td>
            </tr>
            <tr class='text-info'>
              <td>19</td>
              <td>力</td>
              <td> </td>
              <td> </td>
              <td>li4</td>
              <td>сила</td>
              <td>2</td>
              <td>力字旁</td>
            </tr>
            <tr>
              <td>20</td>
              <td>勹</td>
              <td> </td>
              <td> </td>
              <td>bao1</td>
              <td>завертывать</td>
              <td>2</td>
              <td>包字头</td>
            </tr>
            <tr>
              <td>21</td>
              <td>匕</td>
              <td> </td>
              <td> </td>
              <td>bi3</td>
              <td>черпак</td>
              <td>2</td>
            </tr>
            <tr>
              <td>22</td>
              <td>匚</td>
              <td> </td>
              <td> </td>
              <td>fang1</td>
              <td>ящик</td>
              <td>2</td>
              <td>三框</td>
            </tr>
            <tr>
              <td>23</td>
              <td>匸</td>
              <td> </td>
              <td> </td>
              <td>xi3</td>
              <td>прятать</td>
              <td>2</td>
            </tr>
            <tr>
              <td>24</td>
              <td>十</td>
              <td> </td>
              <td> </td>
              <td>shi2</td>
              <td>десять</td>
              <td>2</td>
              <td>十字</td>
            </tr>
            <tr>
              <td>25</td>
              <td>卜</td>
              <td> </td>
              <td> </td>
              <td>bu3</td>
              <td>гадание</td>
              <td>2</td>
            </tr>
            <tr>
              <td>26</td>
              <td>卩</td>
              <td> </td>
              <td> </td>
              <td>jie2</td>
              <td>печать</td>
              <td>2</td>
              <td>单耳刀</td>
            </tr>
            <tr class='text-info'>
              <td>27</td>
              <td>厂</td>
              <td> </td>
              <td> </td>
              <td>han4</td>
              <td>обрыв</td>
              <td>2</td>
              <td>厂字旁</td>
            </tr>
            <tr>
              <td>28</td>
              <td>厶</td>
              <td> </td>
              <td> </td>
              <td>si1</td>
              <td>частный</td>
              <td>2</td>
              <td>私字</td>
            </tr>
            <tr class='text-info'>
              <td>29</td>
              <td>又</td>
              <td> </td>
              <td> </td>
              <td>you4</td>
              <td>снова</td>
              <td>2</td>
              <td>又字旁</td>
            </tr>
            <tr class='text-warning'>
              <td>30</td>
              <td>口</td>
              <td> </td>
              <td> </td>
              <td>kou3</td>
              <td>рот</td>
              <td>3</td>
              <td>口字旁</td>
            </tr>
            <tr class='text-info'>
              <td>31</td>
              <td>囗</td>
              <td> </td>
              <td> </td>
              <td>wei2</td>
              <td>территория с границами</td>
              <td>3</td>
              <td>方框</td>
            </tr>
            <tr class='text-info'>
              <td>32</td>
              <td>土</td>
              <td> </td>
              <td> </td>
              <td>tu3</td>
              <td>земля</td>
              <td>3</td>
              <td>提土旁</td>
            </tr>
            <tr>
              <td>33</td>
              <td>士</td>
              <td> </td>
              <td> </td>
              <td>shi4</td>
              <td>ученый муж</td>
              <td>3</td>
            </tr>
            <tr>
              <td>34</td>
              <td>夂</td>
              <td> </td>
              <td> </td>
              <td>zhi3 (сверху)</td>
              <td>ходить</td>
              <td>3</td>
            </tr>
            <tr>
              <td>35</td>
              <td>夊</td>
              <td> </td>
              <td> </td>
              <td>sui1 (снизу)</td>
              <td>медленно идти</td>
              <td>3</td>
            </tr>
            <tr>
              <td>36</td>
              <td>夕</td>
              <td> </td>
              <td> </td>
              <td>xi1</td>
              <td>вечер</td>
              <td>3</td>
              <td>夕字旁</td>
            </tr>
            <tr class='text-info'>
              <td>37</td>
              <td>大</td>
              <td> </td>
              <td> </td>
              <td>da4</td>
              <td>большой</td>
              <td>3</td>
              <td>大字头</td>
            </tr>
            <tr class='text-info'>
              <td>38</td>
              <td>女</td>
              <td> </td>
              <td> </td>
              <td>nü3</td>
              <td>женщина</td>
              <td>3</td>
              <td>女字旁</td>
            </tr>
            <tr>
              <td>39</td>
              <td>子</td>
              <td>孑</td>
              <td> </td>
              <td>zi3</td>
              <td>ребенок</td>
              <td>3</td>
              <td>子字旁</td>
            </tr>
            <tr class='text-info'>
              <td>40</td>
              <td>宀</td>
              <td> </td>
              <td> </td>
              <td>mian2</td>
              <td>крыша</td>
              <td>3</td>
              <td>宝盖</td>
            </tr>
            <tr>
              <td>41</td>
              <td>寸</td>
              <td> </td>
              <td> </td>
              <td>cun4</td>
              <td>цунь, вершок</td>
              <td>3</td>
              <td>寸字旁</td>
            </tr>
            <tr>
              <td>42</td>
              <td>小</td>
              <td> </td>
              <td> </td>
              <td>xiao3</td>
              <td>маленький</td>
              <td>3</td>
              <td>小字头</td>
            </tr>
            <tr>
              <td>43</td>
              <td>尢</td>
              <td>尣</td>
              <td> </td>
              <td>wang1</td>
              <td>хилый</td>
              <td>3</td>
            </tr>
            <tr class='text-info'>
              <td>44</td>
              <td>尸</td>
              <td> </td>
              <td> </td>
              <td>shi1</td>
              <td>труп</td>
              <td>3</td>
              <td>尸字头</td>
            </tr>
            <tr>
              <td>45</td>
              <td>屮</td>
              <td> </td>
              <td> </td>
              <td>che4</td>
              <td>росток</td>
              <td>3</td>
            </tr>
            <tr class='text-info'>
              <td>46</td>
              <td>山</td>
              <td> </td>
              <td> </td>
              <td>shan1</td>
              <td>гора</td>
              <td>3</td>
              <td>山字旁</td>
            </tr>
            <tr>
              <td>47</td>
              <td>川</td>
              <td>巛, 巜 (gui4)</td>
              <td> </td>
              <td>chuan1</td>
              <td>река</td>
              <td>3</td>
            </tr>
            <tr>
              <td>48</td>
              <td>工</td>
              <td> </td>
              <td> </td>
              <td>gong1</td>
              <td>работа</td>
              <td>3</td>
            </tr>
            <tr>
              <td>49</td>
              <td>己</td>
              <td> </td>
              <td> </td>
              <td>ji3</td>
              <td>сам</td>
              <td>3</td>
            </tr>
            <tr class='text-info'>
              <td>50</td>
              <td>巾</td>
              <td> </td>
              <td> </td>
              <td>jin1</td>
              <td>платок</td>
              <td>3</td>
              <td>巾字旁</td>
            </tr>
            <tr>
              <td>51</td>
              <td>干</td>
              <td> </td>
              <td> </td>
              <td>gan1</td>
              <td>сухой</td>
              <td>3</td>
            </tr>
            <tr>
              <td>52</td>
              <td>幺</td>
              <td> </td>
              <td> </td>
              <td>yao1</td>
              <td>нитка</td>
              <td>3</td>
            </tr>
            <tr>
              <td>53</td>
              <td>广</td>
              <td> </td>
              <td> </td>
              <td>guan3</td>
              <td>широкий</td>
              <td>3</td>
              <td>广字旁</td>
            </tr>
            <tr>
              <td>54</td>
              <td>廴</td>
              <td> </td>
              <td> </td>
              <td>yin3</td>
              <td>тянуть</td>
              <td>3</td>
              <td>建字旁</td>
            </tr>
            <tr>
              <td>55</td>
              <td>廾</td>
              <td> </td>
              <td> </td>
              <td>gong3</td>
              <td>две руки</td>
              <td>3</td>
            </tr>
            <tr>
              <td>56</td>
              <td>弋</td>
              <td> </td>
              <td> </td>
              <td>yi4</td>
              <td>стрелять из лука</td>
              <td>3</td>
            </tr>
            <tr class='text-info'>
              <td>57</td>
              <td>弓</td>
              <td> </td>
              <td> </td>
              <td>gong1</td>
              <td>лук</td>
              <td>3</td>
              <td>弓字旁</td>
            </tr>
            <tr>
              <td>58</td>
              <td>彐</td>
              <td>彑</td>
              <td> </td>
              <td>ji4</td>
              <td>свиная голова</td>
              <td>3</td>
            </tr>
            <tr>
              <td>59</td>
              <td>彡</td>
              <td> </td>
              <td> </td>
              <td>shan1</td>
              <td>волосы</td>
              <td>3</td>
              <td>三撇儿</td>
            </tr>
            <tr class='text-info'>
              <td>60</td>
              <td>彳</td>
              <td> </td>
              <td> </td>
              <td>chi4</td>
              <td>шаг</td>
              <td>3</td>
              <td>双人旁</td>
            </tr>
            <tr class='text-warning'>
              <td>61</td>
              <td>心</td>
              <td>忄</td>
              <td> </td>
              <td>xin1</td>
              <td>сердце</td>
              <td>4</td>
              <td>
                忄, 竖心旁
                <br />
                心, 心字旁
              </td>
            </tr>
            <tr>
              <td>62</td>
              <td>戈</td>
              <td> </td>
              <td> </td>
              <td>ge1</td>
              <td>копье</td>
              <td>4</td>
            </tr>
            <tr>
              <td>63</td>
              <td>户</td>
              <td> </td>
              <td> </td>
              <td>hu4</td>
              <td>двор</td>
              <td>4</td>
              <td>户字旁</td>
            </tr>
            <tr class='text-warning'>
              <td>64</td>
              <td>手</td>
              <td>扌</td>
              <td> </td>
              <td>shou3</td>
              <td>рука</td>
              <td>4</td>
              <td>
                扌, 提手旁
                <br />
                手, 手字旁
              </td>
            </tr>
            <tr>
              <td>65</td>
              <td>支</td>
              <td> </td>
              <td> </td>
              <td>zhi1</td>
              <td>ветка</td>
              <td>4</td>
            </tr>
            <tr class='text-info'>
              <td>66</td>
              <td>攴</td>
              <td>攵</td>
              <td> </td>
              <td>pu1</td>
              <td>ударять палкой</td>
              <td>4</td>
              <td>攵, 反文旁</td>
            </tr>
            <tr>
              <td>67</td>
              <td>文</td>
              <td> </td>
              <td> </td>
              <td>wen2</td>
              <td>письмо</td>
              <td>4</td>
            </tr>
            <tr>
              <td>68</td>
              <td>斗</td>
              <td> </td>
              <td> </td>
              <td>dou3</td>
              <td>ковш</td>
              <td>4</td>
            </tr>
            <tr>
              <td>69</td>
              <td>斤</td>
              <td> </td>
              <td> </td>
              <td>jin1</td>
              <td>топор</td>
              <td>4</td>
              <td>斤字头</td>
            </tr>
            <tr>
              <td>70</td>
              <td>方</td>
              <td> </td>
              <td> </td>
              <td>fang1</td>
              <td>квадрат</td>
              <td>4</td>
              <td>方字旁</td>
            </tr>
            <tr>
              <td>71</td>
              <td>无</td>
              <td> </td>
              <td> </td>
              <td>wu2</td>
              <td>не</td>
              <td>4</td>
            </tr>
            <tr class='text-info'>
              <td>72</td>
              <td>日</td>
              <td> </td>
              <td> </td>
              <td>ri4</td>
              <td>солнце</td>
              <td>4</td>
              <td>日字旁</td>
            </tr>
            <tr>
              <td>73</td>
              <td>曰</td>
              <td> </td>
              <td> </td>
              <td>yue1</td>
              <td>говорить</td>
              <td>4</td>
              <td>冒字头</td>
            </tr>
            <tr>
              <td>74</td>
              <td>月</td>
              <td> </td>
              <td> </td>
              <td>yue4</td>
              <td>луна</td>
              <td>4</td>
              <td>月字旁</td>
            </tr>
            <tr class='text-warning'>
              <td>75</td>
              <td>木</td>
              <td> </td>
              <td> </td>
              <td>mu4</td>
              <td>дерево</td>
              <td>4</td>
              <td>木字旁</td>
            </tr>
            <tr class='text-info'>
              <td>76</td>
              <td>欠</td>
              <td> </td>
              <td> </td>
              <td>qian4</td>
              <td>недоставать</td>
              <td>4</td>
              <td>欠字旁</td>
            </tr>
            <tr class='text-info'>
              <td>77</td>
              <td>止</td>
              <td> </td>
              <td> </td>
              <td>zhi3</td>
              <td>остановиться</td>
              <td>4</td>
              <td>止字旁</td>
            </tr>
            <tr class='text-info'>
              <td>78</td>
              <td>歹</td>
              <td> </td>
              <td> </td>
              <td>dai3</td>
              <td>плохой, злой</td>
              <td>4</td>
            </tr>
            <tr>
              <td>79</td>
              <td>殳</td>
              <td> </td>
              <td> </td>
              <td>shu1</td>
              <td>пика</td>
              <td>4</td>
            </tr>
            <tr>
              <td>80</td>
              <td>毋</td>
              <td> </td>
              <td> </td>
              <td>wu2</td>
              <td>не надо</td>
              <td>4</td>
            </tr>
            <tr>
              <td>81</td>
              <td>比</td>
              <td> </td>
              <td> </td>
              <td>bi3</td>
              <td>сравнивать</td>
              <td>4</td>
            </tr>
            <tr class='text-info'>
              <td>82</td>
              <td>毛</td>
              <td> </td>
              <td> </td>
              <td>mao2</td>
              <td>шерсть</td>
              <td>4</td>
            </tr>
            <tr>
              <td>83</td>
              <td>氏</td>
              <td> </td>
              <td> </td>
              <td>shi4</td>
              <td>клан</td>
              <td>4</td>
            </tr>
            <tr>
              <td>84</td>
              <td>气</td>
              <td> </td>
              <td> </td>
              <td>qi4</td>
              <td>пар</td>
              <td>4</td>
            </tr>
            <tr class='text-warning'>
              <td>85</td>
              <td>水</td>
              <td>氵</td>
              <td> </td>
              <td>shui3</td>
              <td>вода</td>
              <td>4</td>
              <td>氵, 三点水</td>
            </tr>
            <tr class='text-info'>
              <td>86</td>
              <td>火</td>
              <td>灬</td>
              <td> </td>
              <td>huo3</td>
              <td>огонь</td>
              <td>4</td>
              <td>
                灬, 四点底
                <br />
                火, 火字旁
              </td>
            </tr>
            <tr>
              <td>87</td>
              <td>爪</td>
              <td>爫</td>
              <td> </td>
              <td>zhao3</td>
              <td>claw</td>
              <td>4</td>
              <td>爫, 爪字头</td>
            </tr>
            <tr>
              <td>88</td>
              <td>父</td>
              <td> </td>
              <td> </td>
              <td>fu4</td>
              <td>отец</td>
              <td>4</td>
              <td>父字头</td>
            </tr>
            <tr>
              <td>89</td>
              <td>爻</td>
              <td> </td>
              <td> </td>
              <td>yao2</td>
              <td>диаграммы</td>
              <td>4</td>
            </tr>
            <tr>
              <td>90</td>
              <td>爿</td>
              <td>丬</td>
              <td> </td>
              <td>pan2, qiang2</td>
              <td>половина дерева</td>
              <td>4</td>
            </tr>
            <tr>
              <td>91</td>
              <td>片</td>
              <td> </td>
              <td> </td>
              <td>pian4</td>
              <td>щепка</td>
              <td>4</td>
            </tr>
            <tr>
              <td>92</td>
              <td>牙</td>
              <td> </td>
              <td> </td>
              <td>ya2</td>
              <td>зуб, клык</td>
              <td>4</td>
            </tr>
            <tr class='text-info'>
              <td>93</td>
              <td>牛</td>
              <td>牜</td>
              <td> </td>
              <td>niu2</td>
              <td>корова</td>
              <td>4</td>
              <td>牛字旁</td>
            </tr>
            <tr class='text-info'>
              <td>94</td>
              <td>犬</td>
              <td>犭</td>
              <td> </td>
              <td>quan3</td>
              <td>собака</td>
              <td>4</td>
              <td>犭, 反犬旁</td>
            </tr>
            <tr>
              <td>95</td>
              <td>玄</td>
              <td> </td>
              <td> </td>
              <td>xuan2</td>
              <td>черный</td>
              <td>5</td>
            </tr>
            <tr class='text-info'>
              <td>96</td>
              <td>玉</td>
              <td>王</td>
              <td> </td>
              <td>yu4</td>
              <td>нефрит</td>
              <td>5</td>
              <td>王字旁</td>
            </tr>
            <tr>
              <td>97</td>
              <td>瓜</td>
              <td> </td>
              <td> </td>
              <td>gua1</td>
              <td>дыня</td>
              <td>5</td>
            </tr>
            <tr class='text-info'>
              <td>98</td>
              <td>瓦</td>
              <td> </td>
              <td> </td>
              <td>wa3</td>
              <td>черепица</td>
              <td>5</td>
            </tr>
            <tr>
              <td>99</td>
              <td>甘</td>
              <td> </td>
              <td> </td>
              <td>gan1</td>
              <td>сладкий</td>
              <td>5</td>
            </tr>
            <tr>
              <td>100</td>
              <td>生</td>
              <td> </td>
              <td> </td>
              <td>sheng1</td>
              <td>жизнь</td>
              <td>5</td>
            </tr>
            <tr>
              <td>101</td>
              <td>用</td>
              <td> </td>
              <td> </td>
              <td>yong4</td>
              <td>использовать</td>
              <td>5</td>
            </tr>
            <tr class='text-info'>
              <td>102</td>
              <td>田</td>
              <td> </td>
              <td> </td>
              <td>tian2</td>
              <td>поле</td>
              <td>5</td>
              <td>田字旁</td>
            </tr>
            <tr>
              <td>103</td>
              <td>疋</td>
              <td> </td>
              <td> </td>
              <td>pi3</td>
              <td>кусок ткани</td>
              <td>5</td>
            </tr>
            <tr class='text-info'>
              <td>104</td>
              <td>疒</td>
              <td> </td>
              <td> </td>
              <td>chuang2</td>
              <td>болезнь</td>
              <td>5</td>
              <td>病字旁</td>
            </tr>
            <tr>
              <td>105</td>
              <td>癶</td>
              <td> </td>
              <td> </td>
              <td>bo4</td>
              <td>ноги врозь</td>
              <td>5</td>
            </tr>
            <tr class='text-info'>
              <td>106</td>
              <td>白</td>
              <td> </td>
              <td> </td>
              <td>bai2</td>
              <td>белый</td>
              <td>5</td>
              <td>白字旁</td>
            </tr>
            <tr class='text-info'>
              <td>107</td>
              <td>皮</td>
              <td> </td>
              <td> </td>
              <td>pi2</td>
              <td>кожица, кожа</td>
              <td>5</td>
            </tr>
            <tr class='text-info'>
              <td>108</td>
              <td>皿</td>
              <td> </td>
              <td> </td>
              <td>min3</td>
              <td>сосуд</td>
              <td>5</td>
              <td>皿字底</td>
            </tr>
            <tr class='text-info'>
              <td>109</td>
              <td>目</td>
              <td> </td>
              <td> </td>
              <td>mu4</td>
              <td>глаз</td>
              <td>5</td>
              <td>目字旁</td>
            </tr>
            <tr>
              <td>110</td>
              <td>矛</td>
              <td> </td>
              <td> </td>
              <td>mao2</td>
              <td>копье</td>
              <td>5</td>
            </tr>
            <tr>
              <td>111</td>
              <td>矢</td>
              <td> </td>
              <td> </td>
              <td>shi3</td>
              <td>стрела</td>
              <td>5</td>
              <td>矢字旁</td>
            </tr>
            <tr class='text-info'>
              <td>112</td>
              <td>石</td>
              <td> </td>
              <td> </td>
              <td>shi2</td>
              <td>камень</td>
              <td>5</td>
              <td>石字旁</td>
            </tr>
            <tr class='text-info'>
              <td>113</td>
              <td>示</td>
              <td>礻</td>
              <td> </td>
              <td>shi4</td>
              <td>алтарь</td>
              <td>5</td>
              <td>礻, 示字旁</td>
            </tr>
            <tr>
              <td>114</td>
              <td>禸</td>
              <td> </td>
              <td> </td>
              <td>rou3</td>
              <td>след зверя</td>
              <td>5</td>
            </tr>
            <tr class='text-info'>
              <td>115</td>
              <td>禾</td>
              <td> </td>
              <td> </td>
              <td>he2</td>
              <td>злаки</td>
              <td>5</td>
              <td>禾木旁</td>
            </tr>
            <tr class='text-info'>
              <td>116</td>
              <td>穴</td>
              <td> </td>
              <td> </td>
              <td>xue4</td>
              <td>пещера</td>
              <td>5</td>
              <td>穴宝盖</td>
            </tr>
            <tr class='text-info'>
              <td>117</td>
              <td>立</td>
              <td> </td>
              <td> </td>
              <td>li4</td>
              <td>стоять</td>
              <td>5</td>
              <td>立字旁</td>
            </tr>
            <tr class='text-warning'>
              <td>118</td>
              <td>竹</td>
              <td>⺮</td>
              <td> </td>
              <td>zhu2</td>
              <td>бамбук</td>
              <td>6</td>
              <td>竹字头</td>
            </tr>
            <tr class='text-info'>
              <td>119</td>
              <td>米</td>
              <td> </td>
              <td> </td>
              <td>mi3</td>
              <td>рис</td>
              <td>6</td>
              <td>米字旁</td>
            </tr>
            <tr class='text-warning'>
              <td>120</td>
              <td>纟</td>
              <td> </td>
              <td>糸</td>
              <td>mi4</td>
              <td>нить, шелк</td>
              <td>3 (6)</td>
              <td>绞丝旁</td>
            </tr>
            <tr>
              <td>121</td>
              <td>缶</td>
              <td> </td>
              <td> </td>
              <td>fou3</td>
              <td>амфора</td>
              <td>6</td>
              <td>缶字旁</td>
            </tr>
            <tr class='text-info'>
              <td>122</td>
              <td>网</td>
              <td>罒</td>
              <td> </td>
              <td>wang3</td>
              <td>сеть</td>
              <td>6</td>
              <td>
                罒, 皿字头
                <br />
                四子头
              </td>
            </tr>
            <tr class='text-info'>
              <td>123</td>
              <td>羊</td>
              <td> </td>
              <td> </td>
              <td>yang2</td>
              <td>баран</td>
              <td>6</td>
            </tr>
            <tr class='text-info'>
              <td>124</td>
              <td>羽</td>
              <td> </td>
              <td> </td>
              <td>yu3</td>
              <td>перо</td>
              <td>6</td>
            </tr>
            <tr class='text-info'>
              <td>125</td>
              <td>老</td>
              <td> </td>
              <td> </td>
              <td>lao3</td>
              <td>старый</td>
              <td>6</td>
            </tr>
            <tr>
              <td>126</td>
              <td>而</td>
              <td> </td>
              <td> </td>
              <td>er2</td>
              <td>и, а</td>
              <td>6</td>
            </tr>
            <tr>
              <td>127</td>
              <td>耒</td>
              <td> </td>
              <td> </td>
              <td>lei3</td>
              <td>плуг</td>
              <td>6</td>
            </tr>
            <tr class='text-info'>
              <td>128</td>
              <td>耳</td>
              <td> </td>
              <td> </td>
              <td>er3</td>
              <td>ухо</td>
              <td>6</td>
              <td>耳字旁</td>
            </tr>
            <tr>
              <td>129</td>
              <td>聿</td>
              <td> </td>
              <td> </td>
              <td>yu4</td>
              <td>кисть</td>
              <td>6</td>
            </tr>
            <tr class='text-info'>
              <td>130</td>
              <td>肉</td>
              <td> </td>
              <td> </td>
              <td>rou4</td>
              <td>мясо</td>
              <td>6</td>
            </tr>
            <tr>
              <td>131</td>
              <td>臣</td>
              <td> </td>
              <td> </td>
              <td>chen2</td>
              <td>министр, чиновник</td>
              <td>6</td>
            </tr>
            <tr>
              <td>132</td>
              <td>自</td>
              <td> </td>
              <td> </td>
              <td>zi4</td>
              <td>сам</td>
              <td>6</td>
            </tr>
            <tr>
              <td>133</td>
              <td>至</td>
              <td> </td>
              <td> </td>
              <td>zhi4</td>
              <td>прибывать</td>
              <td>6</td>
            </tr>
            <tr>
              <td>134</td>
              <td>臼</td>
              <td> </td>
              <td> </td>
              <td>jiu4</td>
              <td>ступка</td>
              <td>6</td>
            </tr>
            <tr>
              <td>135</td>
              <td>舌</td>
              <td> </td>
              <td> </td>
              <td>she2</td>
              <td>язык</td>
              <td>6</td>
              <td>舌字旁</td>
            </tr>
            <tr>
              <td>136</td>
              <td>舛</td>
              <td> </td>
              <td> </td>
              <td>chuan3</td>
              <td>ошибка</td>
              <td>6</td>
            </tr>
            <tr class='text-info'>
              <td>137</td>
              <td>舟</td>
              <td> </td>
              <td> </td>
              <td>zhou1</td>
              <td>лодка</td>
              <td>6</td>
              <td>舟字旁</td>
            </tr>
            <tr>
              <td>138</td>
              <td>艮</td>
              <td> </td>
              <td> </td>
              <td>gen4</td>
              <td>гэнь, остановка</td>
              <td>6</td>
            </tr>
            <tr>
              <td>139</td>
              <td>色</td>
              <td> </td>
              <td> </td>
              <td>se4</td>
              <td>цвет</td>
              <td>6</td>
            </tr>
            <tr class='text-warning'>
              <td>140</td>
              <td>艸</td>
              <td>艹</td>
              <td> </td>
              <td>cao3</td>
              <td>трава</td>
              <td>6</td>
              <td>艹, 草字头</td>
            </tr>
            <tr class='text-info'>
              <td>141</td>
              <td>虍</td>
              <td> </td>
              <td> </td>
              <td>hu1</td>
              <td>тигр</td>
              <td>6</td>
              <td>虎字头</td>
            </tr>
            <tr class='text-warning'>
              <td>142</td>
              <td>虫</td>
              <td> </td>
              <td> </td>
              <td>chong2</td>
              <td>насекомое</td>
              <td>6</td>
              <td>虫字旁</td>
            </tr>
            <tr>
              <td>143</td>
              <td>血</td>
              <td> </td>
              <td> </td>
              <td>xue3</td>
              <td>кровь</td>
              <td>6</td>
            </tr>
            <tr>
              <td>144</td>
              <td>行</td>
              <td> </td>
              <td> </td>
              <td>xing2</td>
              <td>ходить</td>
              <td>6</td>
            </tr>
            <tr class='text-info'>
              <td>145</td>
              <td>衣</td>
              <td>衤</td>
              <td> </td>
              <td>yi1</td>
              <td>одежда</td>
              <td>6</td>
              <td>衤, 衣字旁</td>
            </tr>
            <tr>
              <td>146</td>
              <td>襾</td>
              <td>覀</td>
              <td> </td>
              <td>ya4</td>
              <td>покрывать</td>
              <td>6</td>
              <td>覀, 西字头</td>
            </tr>
            <tr class='text-info'>
              <td>147</td>
              <td>见</td>
              <td> </td>
              <td>見</td>
              <td>jian4</td>
              <td>видеть</td>
              <td>4 (7)</td>
            </tr>
            <tr class='text-info'>
              <td>148</td>
              <td>角</td>
              <td> </td>
              <td> </td>
              <td>jue2</td>
              <td>рог</td>
              <td>7</td>
              <td>角字旁</td>
            </tr>
            <tr class='text-warning'>
              <td>149</td>
              <td>讠</td>
              <td> </td>
              <td>言</td>
              <td>yan2</td>
              <td>речь</td>
              <td>2 (7)</td>
              <td>言字旁</td>
            </tr>
            <tr>
              <td>150</td>
              <td>谷</td>
              <td> </td>
              <td> </td>
              <td>gu3</td>
              <td>долина</td>
              <td>7</td>
            </tr>
            <tr>
              <td>151</td>
              <td>豆</td>
              <td> </td>
              <td> </td>
              <td>dou4</td>
              <td>боб</td>
              <td>7</td>
            </tr>
            <tr class='text-info'>
              <td>152</td>
              <td>豕</td>
              <td> </td>
              <td> </td>
              <td>shi3</td>
              <td>свинья</td>
              <td>7</td>
            </tr>
            <tr class='text-info'>
              <td>153</td>
              <td>豸</td>
              <td> </td>
              <td> </td>
              <td>zhi4</td>
              <td>пресмыкающееся</td>
              <td>7</td>
            </tr>
            <tr class='text-info'>
              <td>154</td>
              <td>贝</td>
              <td> </td>
              <td>貝</td>
              <td>bei4</td>
              <td>ракушка</td>
              <td>4 (7)</td>
            </tr>
            <tr>
              <td>155</td>
              <td>赤</td>
              <td> </td>
              <td> </td>
              <td>chi4</td>
              <td>красный</td>
              <td>7</td>
            </tr>
            <tr class='text-info'>
              <td>156</td>
              <td>走</td>
              <td> </td>
              <td> </td>
              <td>zou3</td>
              <td>уходить</td>
              <td>7</td>
              <td>走字旁</td>
            </tr>
            <tr class='text-info'>
              <td>157</td>
              <td>足</td>
              <td>⻊</td>
              <td> </td>
              <td>zu2</td>
              <td>нога</td>
              <td>7</td>
              <td>足字旁</td>
            </tr>
            <tr class='text-info'>
              <td>158</td>
              <td>身</td>
              <td> </td>
              <td> </td>
              <td>shen1</td>
              <td>тело</td>
              <td>7</td>
              <td>身字旁</td>
            </tr>
            <tr class='text-info'>
              <td>159</td>
              <td>车</td>
              <td> </td>
              <td>車</td>
              <td>che1</td>
              <td>повозка</td>
              <td>4 (7)</td>
              <td>车字旁</td>
            </tr>
            <tr>
              <td>160</td>
              <td>辛</td>
              <td> </td>
              <td> </td>
              <td>xin1</td>
              <td>горький</td>
              <td>7</td>
            </tr>
            <tr>
              <td>161</td>
              <td>辰</td>
              <td> </td>
              <td> </td>
              <td>chen2</td>
              <td>утро</td>
              <td>7</td>
            </tr>
            <tr class='text-info'>
              <td>162</td>
              <td>辵</td>
              <td>辶</td>
              <td> </td>
              <td>chuo4</td>
              <td>ходить</td>
              <td>7</td>
              <td>走之旁</td>
            </tr>
            <tr class='text-info'>
              <td>163</td>
              <td>邑</td>
              <td>阝 (справа)</td>
              <td> </td>
              <td>yi4</td>
              <td>город</td>
              <td>7</td>
              <td>双耳刀</td>
            </tr>
            <tr class='text-info'>
              <td>164</td>
              <td>酉</td>
              <td> </td>
              <td> </td>
              <td>you3</td>
              <td>ю, десятый знак</td>
              <td>7</td>
            </tr>
            <tr>
              <td>165</td>
              <td>釆</td>
              <td> </td>
              <td> </td>
              <td>bian4</td>
              <td>различать</td>
              <td>7</td>
            </tr>
            <tr>
              <td>166</td>
              <td>里</td>
              <td> </td>
              <td> </td>
              <td>li3</td>
              <td>ли, деревня</td>
              <td>7</td>
            </tr>
            <tr class='text-info'>
              <td>167</td>
              <td>金</td>
              <td>钅</td>
              <td>釒</td>
              <td>jin1</td>
              <td>золото</td>
              <td>8</td>
              <td>金字旁</td>
            </tr>
            <tr>
              <td>168</td>
              <td>长</td>
              <td> </td>
              <td>長</td>
              <td>chang2</td>
              <td>длинный</td>
              <td>4 (8)</td>
            </tr>
            <tr class='text-info'>
              <td>169</td>
              <td>门</td>
              <td> </td>
              <td>門</td>
              <td>men2</td>
              <td>ворота, двери</td>
              <td>3 (8)</td>
              <td>门字框</td>
            </tr>
            <tr class='text-info'>
              <td>170</td>
              <td>阜</td>
              <td>阝(слева)</td>
              <td> </td>
              <td>fu4</td>
              <td>холм</td>
              <td>8</td>
            </tr>
            <tr>
              <td>171</td>
              <td>隶</td>
              <td> </td>
              <td> </td>
              <td>dai4</td>
              <td>слуга</td>
              <td>8</td>
            </tr>
            <tr class='text-info'>
              <td>172</td>
              <td>隹</td>
              <td> </td>
              <td> </td>
              <td>zhui1</td>
              <td>птица с коротким хвостом</td>
              <td>8</td>
              <td>隹字旁</td>
            </tr>
            <tr class='text-info'>
              <td>173</td>
              <td>雨</td>
              <td> </td>
              <td> </td>
              <td>yu3</td>
              <td>дождь</td>
              <td>8</td>
              <td>雨字头</td>
            </tr>
            <tr>
              <td>174</td>
              <td>青</td>
              <td> </td>
              <td> </td>
              <td>qing1</td>
              <td>голубой, зеленый</td>
              <td>8</td>
            </tr>
            <tr>
              <td>175</td>
              <td>非</td>
              <td> </td>
              <td> </td>
              <td>fei1</td>
              <td>не</td>
              <td>8</td>
            </tr>
            <tr>
              <td>176</td>
              <td>面</td>
              <td> </td>
              <td> </td>
              <td>mian4</td>
              <td>лицо</td>
              <td>9</td>
            </tr>
            <tr class='text-info'>
              <td>177</td>
              <td>革</td>
              <td> </td>
              <td> </td>
              <td>ge2</td>
              <td>шкура, кожа</td>
              <td>9</td>
              <td>革字旁</td>
            </tr>
            <tr class='text-info'>
              <td>178</td>
              <td>韦</td>
              <td> </td>
              <td>韋</td>
              <td>wei2</td>
              <td>выделанная кожа</td>
              <td>4 (9)</td>
            </tr>
            <tr>
              <td>179</td>
              <td>韭</td>
              <td> </td>
              <td> </td>
              <td>jiu3</td>
              <td>душистый лук</td>
              <td>9</td>
            </tr>
            <tr>
              <td>180</td>
              <td>音</td>
              <td> </td>
              <td> </td>
              <td>yin1</td>
              <td>звук</td>
              <td>9</td>
              <td>音字旁</td>
            </tr>
            <tr class='text-info'>
              <td>181</td>
              <td>页</td>
              <td> </td>
              <td>頁</td>
              <td>ye4</td>
              <td>лист</td>
              <td>6 (9)</td>
              <td>页字旁</td>
            </tr>
            <tr class='text-info'>
              <td>182</td>
              <td>风</td>
              <td> </td>
              <td>風</td>
              <td>feng1</td>
              <td>ветер</td>
              <td>4 (9)</td>
            </tr>
            <tr class='text-info'>
              <td>183</td>
              <td>飞</td>
              <td> </td>
              <td>飛</td>
              <td>fei1</td>
              <td>летать</td>
              <td>3 (9)</td>
            </tr>
            <tr class='text-info'>
              <td>184</td>
              <td>食</td>
              <td>饣</td>
              <td>飠</td>
              <td>shi2</td>
              <td>есть, еда</td>
              <td>9</td>
              <td>饣, 食字旁</td>
            </tr>
            <tr>
              <td>185</td>
              <td>首</td>
              <td> </td>
              <td> </td>
              <td>shou3</td>
              <td>голова</td>
              <td>9</td>
            </tr>
            <tr>
              <td>186</td>
              <td>香</td>
              <td> </td>
              <td> </td>
              <td>xiang1</td>
              <td>благоухающий</td>
              <td>9</td>
            </tr>
            <tr class='text-info'>
              <td>187</td>
              <td>马</td>
              <td> </td>
              <td>馬</td>
              <td>ma3</td>
              <td>лошадь</td>
              <td>3 (10)</td>
              <td>马字旁</td>
            </tr>
            <tr class='text-info'>
              <td>188</td>
              <td>骨</td>
              <td> </td>
              <td> </td>
              <td>gu3</td>
              <td>кость</td>
              <td>10</td>
              <td>骨字旁</td>
            </tr>
            <tr>
              <td>189</td>
              <td>高</td>
              <td> </td>
              <td> </td>
              <td>gao1</td>
              <td>высокий</td>
              <td>10</td>
            </tr>
            <tr class='text-info'>
              <td>190</td>
              <td>髟</td>
              <td> </td>
              <td> </td>
              <td>biao1</td>
              <td>волосы</td>
              <td>10</td>
            </tr>
            <tr>
              <td>191</td>
              <td>斗</td>
              <td> </td>
              <td>鬥</td>
              <td>dou4</td>
              <td>драться</td>
              <td>4 (10)</td>
            </tr>
            <tr>
              <td>192</td>
              <td>鬯</td>
              <td> </td>
              <td> </td>
              <td>chang4</td>
              <td>вино для жертвоприношений</td>
              <td>10</td>
            </tr>
            <tr>
              <td>193</td>
              <td>鬲</td>
              <td> </td>
              <td> </td>
              <td>li4</td>
              <td>треножник</td>
              <td>10</td>
            </tr>
            <tr class='text-info'>
              <td>194</td>
              <td>鬼</td>
              <td> </td>
              <td> </td>
              <td>gui3</td>
              <td>дух</td>
              <td>10</td>
            </tr>
            <tr class='text-info'>
              <td>195</td>
              <td>鱼</td>
              <td> </td>
              <td>魚</td>
              <td>yu2</td>
              <td>рыба</td>
              <td>8 (11)</td>
              <td>鱼字旁</td>
            </tr>
            <tr class='text-info'>
              <td>196</td>
              <td>鸟</td>
              <td> </td>
              <td>鳥</td>
              <td>niao3</td>
              <td>птица</td>
              <td>5 (11)</td>
              <td>鸟字旁</td>
            </tr>
            <tr>
              <td>197</td>
              <td>卤</td>
              <td> </td>
              <td>鹵</td>
              <td>lu3</td>
              <td>соль</td>
              <td>7 (11)</td>
            </tr>
            <tr class='text-info'>
              <td>198</td>
              <td>鹿</td>
              <td> </td>
              <td> </td>
              <td>lu4</td>
              <td>олень</td>
              <td>11</td>
            </tr>
            <tr class='text-info'>
              <td>199</td>
              <td>麦</td>
              <td> </td>
              <td>麥</td>
              <td>mai4</td>
              <td>пшеница</td>
              <td>7 (11)</td>
            </tr>
            <tr>
              <td>200</td>
              <td>麻</td>
              <td> </td>
              <td> </td>
              <td>ma2</td>
              <td>конопля</td>
              <td>11</td>
            </tr>
            <tr>
              <td>201</td>
              <td>黃</td>
              <td> </td>
              <td> </td>
              <td>huang2</td>
              <td>желтый</td>
              <td>12</td>
            </tr>
            <tr>
              <td>202</td>
              <td>黍</td>
              <td> </td>
              <td> </td>
              <td>shu3</td>
              <td>просо</td>
              <td>12</td>
            </tr>
            <tr class='text-info'>
              <td>203</td>
              <td>黑</td>
              <td> </td>
              <td> </td>
              <td>hei1</td>
              <td>черный</td>
              <td>12</td>
            </tr>
            <tr>
              <td>204</td>
              <td>黹</td>
              <td> </td>
              <td> </td>
              <td>zhi3</td>
              <td>вышивка</td>
              <td>12</td>
            </tr>
            <tr>
              <td>205</td>
              <td>黾</td>
              <td> </td>
              <td>黽</td>
              <td>min3</td>
              <td>лягушка</td>
              <td>8 (13)</td>
            </tr>
            <tr>
              <td>206</td>
              <td>鼎</td>
              <td> </td>
              <td> </td>
              <td>ding3</td>
              <td>треножник дин</td>
              <td>13</td>
            </tr>
            <tr>
              <td>207</td>
              <td>鼓</td>
              <td> </td>
              <td> </td>
              <td>gu3</td>
              <td>барабан</td>
              <td>13</td>
            </tr>
            <tr>
              <td>208</td>
              <td>鼠</td>
              <td> </td>
              <td> </td>
              <td>shu3</td>
              <td>мышь</td>
              <td>13</td>
            </tr>
            <tr>
              <td>209</td>
              <td>鼻</td>
              <td> </td>
              <td> </td>
              <td>bi2</td>
              <td>нос</td>
              <td>14</td>
            </tr>
            <tr>
              <td>210</td>
              <td>齐</td>
              <td> </td>
              <td>齊</td>
              <td>qi2</td>
              <td>ровный, равный</td>
              <td>6 (14)</td>
            </tr>
            <tr class='text-info'>
              <td>211</td>
              <td>齿</td>
              <td> </td>
              <td>齒</td>
              <td>chi3</td>
              <td>зубы</td>
              <td>8 (15)</td>
              <td>齿字旁</td>
            </tr>
            <tr>
              <td>212</td>
              <td>龙</td>
              <td> </td>
              <td>龍</td>
              <td>long2</td>
              <td>дракон</td>
              <td>5 (16)</td>
            </tr>
            <tr>
              <td>213</td>
              <td>龟</td>
              <td> </td>
              <td>龜</td>
              <td>gui1</td>
              <td>черепаха</td>
              <td>7 (16)</td>
            </tr>
            <tr>
              <td>214</td>
              <td>龠</td>
              <td> </td>
              <td> </td>
              <td>yue4</td>
              <td>флейта</td>
              <td>17</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Ключи китайских иероглифов",
  meta: [
    {
      name: "description",
      content:
        "Таблица ключей (radicals) иероглифов китайского языка. С указанием самых распространенных.",
    },
  ],
};
