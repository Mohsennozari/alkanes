import matplotlib.pyplot as plt
import networkx as nx

def draw_alkane(num_carbons):
    if num_carbons < 1 or num_carbons > 20:
        print("لطفاً عددی بین ۱ تا ۲۰ وارد کنید.")
        return
    
    G = nx.Graph()

    # Add carbon atoms
    for i in range(num_carbons):
        G.add_node(f"C{i+1}", color='red')

    # Add hydrogen atoms
    hydrogen_count = num_carbons * 2 + 2
    for i in range(hydrogen_count):
        G.add_node(f"H{i+1}", color='blue')

    # Add bonds
    for i in range(num_carbons):
        if i < num_carbons - 1:
            G.add_edge(f"C{i+1}", f"C{i+2}", color='green')
        G.add_edge(f"C{i+1}", f"H{2*i+1}", color='green')
        G.add_edge(f"C{i+1}", f"H{2*i+2}", color='green')

    # Draw the molecule
    pos = nx.spring_layout(G)
    colors = [node[1]['color'] for node in G.nodes(data=True)]
    edges = G.edges(data=True)
    edge_colors = [edge[2]['color'] for edge in edges]
    
    nx.draw(G, pos, node_color=colors, edge_color=edge_colors, with_labels=True)
    plt.show()

# Example usage
draw_alkane(5)  # عدد ۵ به عنوان مثال وارد شده است
