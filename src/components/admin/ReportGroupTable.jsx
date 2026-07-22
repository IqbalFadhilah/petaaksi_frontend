import ReportGroupCard from './ReportGroupCard'

export default function ReportGroupTable({
  groups,
  expandedRows,
  onToggleExpand,
  onApproveGroup,
  onRejectGroup,
  onRejectReport,
  onImageClick,
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Validasi Laporan Masuk</h2>
        <p>Sistem otomatis mengelompokkan laporan dalam radius kriteria formula Haversine.</p>
      </div>

      <div className="group-table">
        {groups.map((group) => {
          const expanded = expandedRows.includes(group.id)

          return (
            <ReportGroupCard
              key={group.id}
              group={group}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              onApproveGroup={onApproveGroup}
              onRejectGroup={onRejectGroup}
              onRejectReport={onRejectReport}
              onImageClick={onImageClick}
            />
          )
        })}
      </div>
    </div>
  )
}
