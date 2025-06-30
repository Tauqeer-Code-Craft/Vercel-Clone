import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ProjectForm() {
  const [project, setProject] = useState({
    name: '',
    repo: '',
    folder: '',
    framework: '',
    command: '',
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    // store or send this data somewhere
    console.log(project);
    navigate('/status');
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <Input placeholder="Project Name" onChange={e => setProject({ ...project, name: e.target.value })} />
      <Input placeholder="GitHub Repo URL" onChange={e => setProject({ ...project, repo: e.target.value })} />
      <Input placeholder="Root Folder" onChange={e => setProject({ ...project, folder: e.target.value })} />

      <Select onValueChange={val => setProject({ ...project, framework: val })}>
        <SelectTrigger>
          <SelectValue placeholder="Select Framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="node">Node</SelectItem>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="python">Python</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="Build Command" onChange={e => setProject({ ...project, command: e.target.value })} />

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
