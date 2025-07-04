export interface Container {
  Id: string;
  Names: string[];
  Image: string;
  Status: string;
}

export interface GitHubUser {
  githubId: string;
  username: string;
  email?: string;
  avatarUrl?: string;
}

export interface Repo {
  id: number;
  name: string;
  html_url: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
  };
}

export interface Props {
  onClose: () => void;
  importedRepos: Repo[];
  setImportedRepos: React.Dispatch<React.SetStateAction<Repo[]>>;
}
