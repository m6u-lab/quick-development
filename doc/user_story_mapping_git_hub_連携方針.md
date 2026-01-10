# UserStoryMapping × GitHub 連携方針

## 目的
UserStoryMapping（以下 USM）で整理した Story を、GitHub Issue / GitHub Project に安全かつ無料枠で運用可能な形で反映する。

本ドキュメントは **設計判断を固定するための決定記録** であり、実装・運用時の迷いをなくすことを目的とする。

---

## 基本方針（最重要）

- USM と GitHub は **リアルタイム同期しない**
- GitHub は **反映先（Execution Layer）**
- USM は **思考・検討・編集の場（Design Layer）**

> 同期ではなく、**明示的な Export / Update** を行う

---

## 対象とする粒度

- **Story = GitHub Issue**
- Task は扱わない
- Activity / User Flow / Release は **Issueの属性（Projectフィールド）** として扱う

---

## データ対応関係

### USM 側
- Activity（列）
- Story（カード）
- 横並び順序（User Flow）

### GitHub 側
- Issue：Story 本体
- Project v2：管理・可視化
- カスタムフィールド：
  - Activity
  - Flow Order
  - Release（MVP / R1 / R2）
  - Status

---

## Story と Issue を結ぶ識別子

### USM
- Story は **永続的な storyId（UUID）** を必ず持つ

### GitHub Issue
- Issue body に以下を必ず埋め込む

```
<!-- usm-story-id: story-xxxx -->
```

この ID を唯一の対応キーとする。

---

## 更新パターン別の挙動

### 1. Story 追加
- Export 時に **新規 Issue 作成**
- Project に追加
- Activity / Flow Order を設定

### 2. Story 文言変更
- **デフォルトでは Issue を更新しない**
- Export 時に明示オプションがある場合のみ更新

### 3. Story 移動・並び替え
- Project フィールド（Activity / Flow Order）のみ更新
- Issue 本文・タイトルは変更しない

### 4. Story 削除
- Issue は **削除しない**
- Status を `Removed / Orphaned` に変更するか、コメントで通知

### 5. Story 分割・統合
- 新 Story = 新 Issue
- 旧 Issue は残す（履歴保持）

---

## リアルタイム反映を採用しない理由

- GitHub API 無料枠の Rate Limit 制約
- ドラッグ・並び替え操作が API 的に高コスト
- トランザクション非対応による整合性崩壊リスク

→ **無料・安定・実用**を同時に満たすため、リアルタイム同期は行わない

---

## Export UI の最低要件

- 新規 Issue 作成数の表示
- 既存 Issue 更新数の表示
- 削除は行わない
- 更新対象のチェックボックス
  - タイトル
  - Activity
  - Flow Order

---

## 結論

- UserStoryMapping は「考えるためのキャンバス」
- GitHub Issue / Project は「決めたことを動かす場所」

この役割分離を崩さない限り、
- AI生成
- 自動 Issue 化
- 無料運用

をすべて両立できる。

