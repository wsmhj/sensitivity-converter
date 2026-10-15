'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {buildReport,TURN_OBSERVATIONS,type TurnObservation,type Score} from '@/lib/range-report';
import {SCENARIOS,modeName,type RangeMode} from '@/lib/range';

export default function RangeReport({score,history,onPractice,onObservation}:{score:Score;history:Score[];onPractice:(mode:RangeMode)=>void;onObservation:(value:TurnObservation)=>void}){
  const report=useMemo(()=>buildReport(score,history),[score,history]);
  const [observation,setObservation]=useState<TurnObservation>(score.observation||''),[updated,setUpdated]=useState(false);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({behavior:'smooth',block:'start'});},[]);
  const next=report.next;
  return <section className="coaching-report" aria-label="Your practice report">
    <header><span className="section-kicker">YOUR ROUND / YOUR NEXT STEP</span><h3 ref={heading} tabIndex={-1}>Know what to work on next</h3><p>{modeName(score.mode)} · {score.hits} kills · {score.shots} shots. Feedback uses this round’s recorded results.</p></header>
    {updated&&<p className="report-confirmation" role="status">Report updated. Your turn observation is saved with this round for this visit; the focus and next goal below have been updated. Measured scores are unchanged.</p>}
    <div className="report-summary">
      <article><span>WHAT WENT WELL</span><h4>{report.strengths.length?report.strengths.map(s=>SCENARIOS[s.scenario].name).join(' & '):'A baseline to build on'}</h4><p>{report.strengths[0]?.good[0]||(score.hits?`You landed ${score.hits} headshot eliminations. The skill cards separate that success from the areas that still need practice.`:'There are no recorded eliminations yet. Complete the suggested drill to collect a useful baseline.')}</p></article>
      <article><span>FOCUS NEXT</span><h4>{report.turnAdvice?'Turn comfort · your observation':next?SCENARIOS[next.scenario].name:'Complete a drill'}</h4><p>{report.turnAdvice?report.turnAdvice.summary+' '+report.turnAdvice.focus:next?.focus[0]||'Start a practice round to collect results.'}</p></article>
    </div>
    {next&&<div className="report-challenge"><div><span className="section-kicker">ONE CLEAR GOAL</span><h4>{report.turnAdvice?.goal||next.goal}</h4><p>{report.prior?'A matching previous round is available below.':'This is your baseline for these settings. Repeat it once to see what changed.'}{report.best!==null?` Previous matching-session best: ${Math.round(report.best)}% ${next.scenario==='tracking'?'time on target':'shot accuracy'}.`:''}</p></div><button type="button" className="action-primary" data-analytics-id="practice_report_focus" onClick={()=>onPractice(next.scenario)}>Practice {SCENARIOS[next.scenario].name.toLowerCase()} · 30s</button></div>}
    <div className="report-skills">{report.skills.map(skill=><article key={skill.scenario} className="report-skill" data-level={skill.status}>
      <div className="report-skill-heading"><h4>{SCENARIOS[skill.scenario].name}</h4><span>{skill.status==='strong'?'Practice goal met':skill.status==='developing'?'Build consistency':'More attempts needed'}</span></div>
      <div className="report-metric"><strong>{skill.metric===null?'—':Math.round(skill.metric)+'%'}</strong><span>{skill.scenario==='tracking'?'Time on a live head':'Headshot accuracy'}</span></div>
      {skill.metric!==null&&<meter min="0" max="100" value={skill.metric} aria-label={`${SCENARIOS[skill.scenario].name} ${skill.scenario==='tracking'?'time on target':'accuracy'}`}>{Math.round(skill.metric)}%</meter>}
      <ul className="report-evidence">{skill.evidence.map(line=><li key={line}>{line}</li>)}</ul>
      <h5>What you did well</h5>{skill.good.map(line=><p key={line}>{line}</p>)}
      {skill.scenario==='turns'&&report.turnAdvice&&<div className="report-delta"><h5>Your turn observation</h5><p>{report.turnAdvice.summary}</p><p>{report.turnAdvice.focus}</p><p>Self-reported; this does not change the measured accuracy above.</p></div>}
      <h5>What to improve</h5>{skill.focus.map(line=><p key={line}>{line}</p>)}
      {skill.comparison.length>0&&<div className="report-delta"><h5>Since your last matching round</h5>{skill.comparison.map(line=><p key={line}>{line}</p>)}</div>}
      <p className="report-goal"><strong>Next goal:</strong> {skill.goal}</p>
      <button type="button" data-analytics-id={`practice_report_${skill.scenario}`} onClick={()=>onPractice(skill.scenario)}>Repeat this skill · 30s</button>
    </article>)}</div>
    {report.skills.some(s=>s.scenario==='turns')&&<section className="range-comfort" aria-label="Turn observation"><h4>How did the turns feel?</h4><p>Choose what you noticed, then update this round’s report. This changes the focus and practice goal, not your measured scores or sensitivity.</p><label>Turn comfort<select aria-label="Turn comfort" value={observation} onChange={e=>{setObservation(e.target.value as TurnObservation);setUpdated(false);}}><option value="">No observation</option>{(Object.entries(TURN_OBSERVATIONS) as [Exclude<TurnObservation,''>,string][]).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><button type="button" data-analytics-id="update_turn_observation" disabled={observation===(score.observation||'')} onClick={()=>{onObservation(observation);setUpdated(true);heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({behavior:'smooth',block:'start'});}}>Update this report</button><p>{score.observation?'Saved with this round: '+TURN_OBSERVATIONS[score.observation]:'No turn observation saved for this round.'} Session reports clear on page reload.</p></section>}
    <div className="report-bottom"><button type="button" data-analytics-id="repeat_matching_report" onClick={()=>onPractice(score.mode)}>Repeat the same {score.mode==='quick'?'60-second check':'30-second drill'}</button><p>Keep the same settings for the repeat. Change one thing at a time when comparing trials.</p></div>
    <details className="report-method"><summary>How to read this feedback</summary><p>These are transparent practice goals, not ranks or comparisons with other players: 80% headshot accuracy from at least 5 shots, or 35% time on a live moving head after at least 8 seconds. They are guides for this range, not a claim about your game skill. Faster target times are compared only when both rounds include at least 3 kills. Average target time includes aiming and corrections; it is not a reaction-time test.</p><p>Comparisons require the same game, actual sensitivity, yaw, DPI, FOV, input mode, range size and scenario. Respawn time is excluded from tracking percentages. We cannot tell whether you overshot or stopped short from unsigned miss distance alone. One round cannot identify your ideal sensitivity. Reports stay in this page session and reset on reload.</p></details>
  </section>;
}
