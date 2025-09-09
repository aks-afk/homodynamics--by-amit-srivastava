import React, { useState, useEffect, useRef } from 'react';
// FIX: Replace monolithic d3 import with modular imports.
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { range } from 'd3-array';
import { lineRadial, curveLinearClosed } from 'd3-shape';

const PurusarthasViz: React.FC = () => {
    const ref = useRef<SVGSVGElement>(null);
    const [dharma, setDharma] = useState(50);
    const [artha, setArtha] = useState(50);
    const [kama, setKama] = useState(50);
    const [moksha, setMoksha] = useState(50);

    const data = [
      { axis: "Dharma", value: dharma / 100 },
      { axis: "Artha", value: artha / 100 },
      { axis: "Kāma", value: kama / 100 },
      { axis: "Mokṣa", value: moksha / 100 },
    ];

    useEffect(() => {
        if (!ref.current) return;

        const width = 300;
        const height = 300;
        const margin = { top: 40, right: 40, bottom: 40, left: 40 };
        const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right);

        const svg = select(ref.current)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .html('');
        
        const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

        const angleSlice = (Math.PI * 2) / data.length;
        const rScale = scaleLinear().range([0, radius]).domain([0, 1]);

        // Grid
        g.selectAll(".grid-circle")
          .data(range(1, 6).reverse())
          .join("circle")
          .attr("r", d => radius / 5 * d)
          .style("fill", "#FCFBF8")
          .style("stroke", "#EAE8E1")
          .style("fill-opacity", 0.8);

        // Axes
        const axis = g.selectAll(".axis")
            .data(data)
            .enter().append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr("stroke", "#C1C1C1")
            .attr("stroke-width", "1px");

        axis.append("text")
            .attr("x", (d, i) => rScale(1.25) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y", (d, i) => rScale(1.25) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d.axis)
            .style("font-size", "14px")
            .attr("text-anchor", "middle");

        // Radar area
        const radarLine = lineRadial<{axis: string, value: number}>()
          .curve(curveLinearClosed)
          .radius(d => rScale(d.value))
          .angle((d, i) => i * angleSlice);

        g.selectAll(".radar-area")
          .data([data])
          .join("path")
          .attr("class", "radar-area")
          .attr("d", radarLine)
          .style("fill", "#3A3A3A")
          .style("fill-opacity", 0.2);
        
        g.selectAll(".radar-stroke")
          .data([data])
          .join("path")
          .attr("class", "radar-stroke")
          .attr("d", radarLine)
          .style("fill", "none")
          .style("stroke", "#3A3A3A")
          .style("stroke-width", "2px");

    }, [data]);

    const Slider = ({ label, value, onChange }: { label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
      <div style={{ marginBottom: '0.25rem' }}>
        <label style={{ display: 'block', marginBottom: '0.1rem', color: '#5A5A5A', fontSize: '0.9rem' }}>{label}</label>
        <input type="range" min="0" max="100" value={value} onChange={onChange} style={{ width: '100%', accentColor: '#3A3A3A' }} />
      </div>
    );

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Balancing Life's Objectives</h4>
            <svg ref={ref}></svg>
            <Slider label="Dharma (Righteousness)" value={dharma} onChange={e => setDharma(+e.target.value)} />
            <Slider label="Artha (Prosperity)" value={artha} onChange={e => setArtha(+e.target.value)} />
            <Slider label="Kāma (Pleasure)" value={kama} onChange={e => setKama(+e.target.value)} />
            <Slider label="Mokṣa (Liberation)" value={moksha} onChange={e => setMoksha(+e.target.value)} />
        </div>
    );
};

export default PurusarthasViz;
