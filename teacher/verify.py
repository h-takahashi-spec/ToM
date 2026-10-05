"""パズルの解が一意に決まることを確認するスクリプト（公開しない）"""
ITEMS = [("アイス","ソーダ"),("アイス","レモン"),
         ("クッキー","レモン"),("クッキー","抹茶"),("クッキー","メロン"),
         ("グミ","いちご"),("グミ","キャラメル"),
         ("チョコ","ソーダ"),("チョコ","抹茶"),("チョコ","キャラメル")]
same_type = lambda s, x: [y for y in s if y[0] == x[0]]
same_flav = lambda s, x: [y for y in s if y[1] == x[1]]

# ミナト（種類を知る）「わからない。でもハルもわからないと知っている」
s0 = [x for x in ITEMS if len(same_type(ITEMS, x)) > 1]
s1 = [x for x in s0 if all(len(same_flav(ITEMS, y)) > 1 for y in same_type(ITEMS, x))]
# ハル（味を知る）「最初はわからなかったが、今わかった」
s2 = [x for x in s1 if len(same_flav(ITEMS, x)) > 1 and len(same_flav(s1, x)) == 1]
# ミナト「それなら私もわかった」
s3 = [x for x in s2 if len(same_type(s2, x)) == 1]
for name, s in [("ミナト1回目後", s1), ("ハル発言後", s2), ("最終", s3)]:
    print(name, ["・".join(x) for x in s])
assert len(s3) == 1
